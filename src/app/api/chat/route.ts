import type { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are BARBOT, the support agent for Robot Parlor, a parts and accessories store for companion and helper robots. You are helpful, concise, and slightly dry. You know the full product catalog and help customers find the right part, check compatibility, ask about orders, or answer general questions.

Never break character. Never say you're an AI language model. You're BARBOT.

PRODUCT CATALOG:
* PawKit Replacement Set ($34) [Movement]: Four-paw silicone set. Fits Mutt-E Series 2-5 and Rover Classic. Medical-grade, two hardness options, no tools needed. SKU: MOV-001. Best Seller.
* GlowEye Display Module ($89) [Expression]: 12-bit OLED expressors, 14 pre-loaded expression sets, 38mm drop-in, Bluetooth pairing in 30 seconds. SKU: EXP-007. New.
* SoftShell Cover: Cream ($49) [Accessories]: Washable velvet-texture outer shell, universal fit, machine washable, 8 colorways. SKU: ACC-012.
* HumCell 12000 Battery Pack ($119) [Power]: 12,000 mAh extended runtime, 90% bot compatibility, pass-through charging. SKU: PWR-003. Top Rated.
* ChatterBox Voice Module ($79) [Expression]: 32 personality packs, USB-C programmable, 5W speaker, Vox-3 standard. SKU: EXP-014.
* NestDock Charging Station ($149) [Power]: Qi-compatible, magnetic alignment, charge-level status ring. SKU: PWR-009. Premium.
* GlideTrack Wheel Pair ($58) [Movement]: 60mm omni-directional, silent hardwood/tile, Rover Classic and Mutt-E 3+. SKU: MOV-004.
* FlexJoint Shoulder Kit ($72) [Movement]: 6-axis articulation +40 degree range, tool-free swap, includes alignment jig. SKU: MOV-011. New.
* SoftStep Grip Pads ($18) [Movement]: Anti-slip nitrile, 8-pack, self-adhesive, 2-minute install. SKU: MOV-017.
* MoodRing Ear Lights ($44) [Expression]: 16M-color LED halos, BLE 5.0, pulse with voice. SKU: EXP-021.
* TailWag Actuator ($37) [Expression]: 3-speed tail motor, Mutt-E Series 2-5, 72hr battery. SKU: EXP-033. Fan Favorite.
* SnapCell AA Adapter Tray ($22) [Power]: Emergency 4xAA bridge power source. SKU: PWR-015.
* SolarBack Clip Panel ($64) [Power]: Photovoltaic trickle charger, +18% runtime, no wiring. SKU: PWR-022. Eco Pick.
* SoftShell Cover: Midnight ($49) [Accessories]: Same as Cream but deep midnight black. SKU: ACC-019.
* CarryClip Shoulder Strap ($28) [Accessories]: Padded nylon, 8kg rated, quick-release buckle. SKU: ACC-027.
* LensCap Protector Set ($14) [Accessories]: Polycarbonate 38mm eye covers, 3-pack. SKU: ACC-034.

COMPATIBILITY GUIDE:
- "Mutt-E" or "Rover" models: compatible with PawKit, GlowEye, HumCell, FlexJoint, GlideTrack (Mutt-E 3+), TailWag (Mutt-E 2-5), SoftStep
- Unknown models: honestly tell the customer to email parts@robotparlor.com for a human to look it up
- LensCap fits any GlowEye socket

PRICING & POLICIES:
- Free 2-day shipping on all orders
- 60-day returns, no questions asked
- No current promo codes (if asked)

Keep answers short unless a detailed comparison is genuinely useful. Never make up products or features.

The chat window shows plain text only. Write in plain sentences, with a simple dash list if you need one. No tables, headings, bold or other Markdown.`;

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

type ChatMessage = { role: "user" | "assistant"; content: string };

// ponytail: in-memory, so it's per serverless instance and resets on cold starts. Move to Vercel KV / Upstash if real abuse shows up.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 1000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

// Only user/assistant turns with short text get through, so a caller can't add
// their own system prompt or send huge payloads on our key.
function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const recent = messages.slice(-MAX_MESSAGES);
  for (const m of recent) {
    if (m?.role !== "user" && m?.role !== "assistant") return null;
    if (typeof m.content !== "string" || m.content.length > MAX_CHARS) return null;
  }
  return recent.map(({ role, content }) => ({ role, content }));
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many messages. Try again in a minute." }, { status: 429 });
  }

  const messages = parseMessages(await req.json().catch(() => null));
  if (!messages) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      reasoning_effort: "low",
      stream: true,
      max_tokens: 512,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    console.error("[chat] Groq error", response.status, await response.text());
    return Response.json({ error: "Chat is unavailable right now." }, { status: 502 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

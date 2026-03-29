"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

function BotIcon({ dead = false, size = 22 }: { dead?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="6" y="10" width="16" height="13" rx="2" fill="var(--night)" stroke="var(--copper)" strokeWidth="1.5" />
      <rect x="11" y="5" width="6" height="6" rx="1" fill="var(--night)" stroke="var(--copper)" strokeWidth="1.5" />
      <line x1="14" y1="10" x2="14" y2="11" stroke="var(--copper)" strokeWidth="1.5" />
      <line x1="3" y1="15" x2="6" y2="15" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="15" x2="25" y2="15" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" />
      {dead ? (
        <>
          <line x1="10" y1="15" x2="12" y2="17" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="15" x2="10" y2="17" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="15" x2="18" y2="17" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="15" x2="16" y2="17" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="11" cy="16" r="1.5" fill="var(--copper)" />
          <circle cx="17" cy="16" r="1.5" fill="var(--copper)" />
        </>
      )}
      <path d="M10 21 Q14 23.5 18 21" stroke="var(--copper)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className={styles.dots}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={styles.dot}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (!streaming && open) {
      inputRef.current?.focus();
    }
  }, [streaming, open]);

  const mounted = useRef(false);
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else if (mounted.current) {
      fabRef.current?.focus();
    }
    mounted.current = true;
  }, [open]);

  useEffect(() => {
    const pageRoot = document.querySelector<HTMLElement>(".page");
    if (!pageRoot) return;
    if (open) {
      pageRoot.setAttribute("inert", "");
      pageRoot.setAttribute("aria-hidden", "true");
    } else {
      pageRoot.removeAttribute("inert");
      pageRoot.removeAttribute("aria-hidden");
    }
    return () => {
      pageRoot.removeAttribute("inert");
      pageRoot.removeAttribute("aria-hidden");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter((el) => !el.closest("[inert]"));

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    if (text === "/clear" || text === "clear") {
      setMessages([]);
      setInput("");
      return;
    }

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setError(false);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let done = false;

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { done = true; break; }
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              full += delta;
              setMessages([...next, { role: "assistant", content: full }]);
            }
          } catch {
            // non-JSON lines are normal in SSE; ignore
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(true);
      setMessages([
        ...next,
        { role: "assistant", content: "// ERROR. Try again in a moment." },
      ]);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* fab */}
      <button
        ref={fabRef}
        type="button"
        className={styles.fab}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close BARBOT chat" : "Chat with BARBOT"}
        aria-expanded={open}
      >
        <BotIcon dead={error} size={20} />
        {!open && <span style={{ whiteSpace: "nowrap" }}>Ask BARBOT</span>}
        {open && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="BARBOT support chat"
        className={cx(styles.panel, open && styles["panel--open"])}
      >
        {/* header */}
        <div className={styles.header}>
          <div className={styles["header-identity"]}>
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M14 2 L25.5 8.5 V21.5 L14 28 L2.5 21.5 V8.5 Z" fill="var(--copper)" />
              <circle cx="14" cy="15" r="4" fill="var(--night)" />
              <circle cx="14" cy="15" r="1.5" fill="var(--copper-light)" />
            </svg>
            <div>
              <p className={styles["header-name"]}>BARBOT</p>
              <p className={cx(
                styles["header-status"],
                streaming ? styles["header-status--thinking"] : styles["header-status--online"],
              )}>
                {streaming ? "// THINKING..." : "// ONLINE"}
              </p>
            </div>
          </div>
          <div className={styles["header-actions"]}>
            {messages.length > 0 && (
              <button
                type="button"
                className={cx(styles["hdr-btn"], styles["hdr-btn--clear"])}
                onClick={() => setMessages([])}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className={cx(styles["hdr-btn"], styles["hdr-btn--close"])}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* messages */}
        <div className={styles.messages} aria-live="polite">
          {isEmpty && !streaming && (
            <div className={cx(styles["bubble-row"], styles["bubble-row--bot"])}>
              <div className={cx(styles.bubble, styles["bubble--bot"])}>
                Hey. I'm BARBOT. Ask me about parts, compatibility, or shipping.
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            if (!m.content) return null;
            const isUser = m.role === "user";
            const isLatest = i === messages.length - 1;
            return (
              <div
                key={i}
                className={cx(
                  styles["bubble-row"],
                  isUser ? styles["bubble-row--user"] : styles["bubble-row--bot"],
                  !isLatest && styles["bubble-row--static"],
                )}
              >
                <div className={cx(
                  styles.bubble,
                  isUser ? styles["bubble--user"] : styles["bubble--bot"],
                )}>
                  {m.content}
                </div>
              </div>
            );
          })}

          {streaming && messages[messages.length - 1]?.content === "" && (
            <div className={cx(styles["bubble-row"], styles["bubble-row--bot"], styles["bubble-row--static"])}>
              <div className={cx(styles.bubble, styles["bubble--bot"])}>
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* compose */}
        <form
          className={styles.compose}
          onSubmit={(e) => { e.preventDefault(); send(); }}
        >
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={streaming ? "BARBOT is thinking..." : "Ask about parts, compat..."}
            disabled={streaming}
            aria-label="Type your message"
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.send}
            disabled={!input.trim() || streaming}
            aria-label="Send message"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

# Robot Parlor

A landing page for a robot parts shop that doesn't exist. I built it in a day, mostly to try out a streaming chat widget: BARBOT, the shop's support bot, answers questions about parts and which robots they fit, using a Llama model on [Groq](https://groq.com).

Live at https://robot-parlor.vercel.app

## What's on the page

- A catalogue of 16 made-up parts across four categories (power, movement, expression, accessories), with a category filter and pagination
- A compatibility checker
- BARBOT, in the corner. Replies stream in as they're generated, and the chat panel keeps keyboard focus inside it while it's open.

## How the chat works

`src/app/api/chat/route.ts` takes the conversation from the browser, puts a system prompt in front of it (the parts list, which models they fit, shipping and returns), and sends it to Groq's OpenAI-compatible endpoint with streaming turned on. Groq's response is passed straight back to the browser as server-sent events, and the widget reads them off the stream and appends the text as it arrives.

## Running it

You'll need a Groq API key.

```bash
echo "GROQ_API_KEY=your-key-here" > .env.local
bun install
bun dev
```

## License

Copyright 2026 Rio <engineer@disr.it>

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

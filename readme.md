# Once Helper Agent

A TypeScript Discord bot that scrapes the OnceUI documentation and provides AI-powered answers.

## Features
- **Documentation Scraping & Embedding:** Scrapes [OnceUI Docs](https://once-ui.com/docs) (including subdirectories), extracts titles, headers, content, and code snippets, and builds vector embeddings for semantic search.
- **Thread Management:** Monitors the `once-helper-threads` channel, auto-detects new threads/questions, and prevents duplicate threads with cooldowns.
- **AI-Powered Responses:** Uses the Groq API to generate concise, technical answers (with TypeScript code examples and deep links to docs).
- **Feedback System:** Adds 👍/👎 reactions to responses and stores feedback.
- **Optimizations:** Implements rate limiting (5 requests/user/minute) and uses Redis for caching.
- **Health Checks & Scheduling:** Includes health checks for Redis/Groq and a daily scheduler for re-scraping documentation.

## Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example`.
4. For development, run `npm run dev`. For production, run `npm run build` then `node dist/bot/index.js`.
5. Optionally, use PM2 with `pm2.config.js` for process management.

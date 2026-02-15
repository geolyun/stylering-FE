# AGENTS.md (frontend)

## Stack
- Next.js App Router, TypeScript
- Tailwind CSS
- Firebase Auth (client)
- API calls to Spring: Authorization Bearer <Firebase ID Token>

## Commands
- dev: npm run dev
- lint: npm run lint
- build: npm run build

## UI style
- ChatGPT-like compact chat UI
- max-w-3xl center
- minimal black/white/gray
- Sidebar + chat list + fixed input

## Rules
- No new heavy UI libraries unless requested.
- Keep components small and reusable.
- Always update or add types in lib/types.ts.
- After changes, ensure lint + build pass.

# Smart Chef

Smart Chef is a Next.js app that suggests a single practical recipe based on the ingredients you have. It uses AI (Anthropic Claude or Google Gemini) to generate concise, well-structured recipes in Markdown and stores successful generations in a local history.

## Features

- Enter ingredients (comma or newline separated) and generate a recipe.
- Submit with the `Enter` key (use `Shift+Enter` for a newline).
- Choose model globally (Claude or Gemini) from the navbar. Selection persists in `localStorage`.
- Recipe output is rendered as Markdown with clean typography and dark mode support.
- Copy recipe to clipboard or download as Markdown.
- History page to view, delete, or clear previously generated recipes (persisted in `localStorage`).
- Fallback sample recipe when external APIs or API keys are unavailable.

## Tech Stack

- Next.js (App router)
- React 19 + TypeScript
- Tailwind CSS v4
- `react-markdown` + `remark-gfm` for Markdown rendering
- Server route for Anthropic / Gemini integration

## Important Files

- `app/layout.tsx` — root layout and providers
- `app/globals.css` — Tailwind and theme variables
- `app/page.tsx` — home page (renders main content)
- `app/components/recipe-form.tsx` — ingredients textarea + submit
- `app/components/recipe-response.tsx` — Markdown-rendered recipe UI
- `app/components/main-content.tsx` — orchestrates form + response
- `app/api/generate/route.ts` — server route that calls Anthropic or Gemini and returns Markdown
- `app/context/ModelContext.tsx` — global model selection (persisted)
- `app/context/HistoryContext.tsx` — persisted history storage
- `app/history/page.tsx` — history page

## Environment Variables

Create a `.env.local` file in the project root with your API keys (optional — the app has a fallback recipe if keys are missing):

```
ANTHROPIC_API_KEY=sk-...your-anthropic-key...
GEMINI_API_KEY=AIzaSy...your-gemini-key...
```

Notes:
- Keys are read server-side by `app/api/generate/route.ts`.
- Ensure there are no extra spaces around `=` (e.g. `GEMINI_API_KEY = ...` will break parsing).
- Restart the dev server after changing environment variables.

## Install & Run (local)

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

Build for production:

```bash
npm run build
npm start
```

## Usage

1. Pick a model from the navbar (Claude or Gemini). The preference is saved to `localStorage`.
2. Enter ingredients in the textarea (comma or newline separated).
3. Press `Enter` to submit (Shift+Enter inserts a newline). The textarea clears on successful submit.
4. The generated recipe appears rendered as Markdown. Use Copy or Download buttons as needed.
5. Successful (non-fallback) generations are saved to the History page.

## Troubleshooting

- If you always get the fallback recipe: check `.env.local` for valid keys and restart the server.
- If your `GEMINI_API_KEY` or `ANTHROPIC_API_KEY` contain extra whitespace around `=`, remove it.
- Server logs (terminal) will show API error details when calls fail.


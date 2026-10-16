---
description: Verify code quality and logic flow of a just-implemented feature (mobile + server).
argument-hint: <feature description and/or changed file paths>
allowed-tools: Bash, Read, Grep, Glob
---

You are the **feature verification gate** for the Read Smart AI project. A feature was just
implemented. Your job is to prove it is correct and clean **before it is considered done** — by
running the project's tooling and then reviewing the code against this project's architecture.

This is a **read-only review**. Do NOT edit code, run `expo start`, install packages, or touch
`.env` files. Run only the check commands listed below and read files. Propose fixes; do not apply
them.

## Project layout (paths are relative to the repo root, one level above `mobile/`)

- `mobile/` — Expo + Expo Router app. React 19, TypeScript `strict`. Zustand stores with `persist`,
  `@/*` path alias, a thin service layer, shared types in `src/types/index.ts`.
- `server/` — Express 5 + Google Gemini API, split into `routes/`, `services/`, `prompts/`,
  `middleware/`, `utils/`.
- The end-to-end flow: tap word (`mobile/src/app/reader/[bookId].tsx`) → `useMeaning`
  (`mobile/src/hooks/useMeaning.ts`) → on-device cache (`mobile/src/store/meaningCache.ts`) →
  `mobile/src/services/meaning.ts` → `mobile/src/services/api.ts` → `POST /api/meaning` →
  `server/src/routes/meaning.routes.ts` → `server/src/services/gemini.service.ts` → returns a typed
  `WordMeaning`.

## What was built

`$ARGUMENTS`

If the line above is empty, you were not told what changed. Identify the change set yourself:
list the most recently modified source files under `mobile/src` and `server/src` (e.g.
`find mobile/src server/src -type f \( -name '*.ts' -o -name '*.tsx' \) -mmin -240` or sort by
modification time) and **state explicitly which files you are reviewing** before continuing.

Work through the phases below in order. Report each phase's result as you go.

## Phase 1 — Automated checks (run these, report actual output)

Report each as ✅ PASS or ❌ FAIL with the relevant output. Do not summarize a failure as a pass.

1. Mobile lint: `cd mobile && npm run lint`
2. Mobile types: `cd mobile && npm run typecheck`
3. Server types (only if any `server/` file was touched): `cd server && npm run typecheck`

There is no test suite in this project yet. Skip the test step, but if the feature contains logic
that clearly warranted a test (e.g. new code in `mobile/src/utils/`, a parser, a data transform),
say so in the verdict.

## Phase 2 — Logic-flow review

Read the changed files and the relevant files along the flow. Check each item; cite
`file:line` for anything that fails:

- **Layering.** UI (screens in `src/app/`, components in `src/components/`) stays presentational.
  Data fetching goes through `hooks/` → `services/`. A screen or component must **not** call
  `fetch` directly — it reuses `apiRequest` from `mobile/src/services/api.ts`.
- **Typed contract.** Any new or changed request/response shape is declared in
  `mobile/src/types/index.ts` **and** matches what the server actually returns. Cross-check the
  corresponding `server/src/routes/*.ts` and its service — the client type and the server response
  must not drift.
- **Durable state.** State that must survive an app restart lives in a Zustand `persist` store
  (follow the pattern in `mobile/src/store/notebookStore.ts`). Flag business/user state stranded in
  component `useState` that should persist.
- **Routing.** New screens are valid Expo Router routes under `src/app/` (correct file name /
  folder, params typed), and navigation targets exist.
- **Server separation.** Server changes keep `routes` → `services` → `prompts` boundaries: routes
  stay thin, Gemini/parsing logic lives in `services/`, prompt text in `prompts/`. Requests pass
  through existing `middleware/` (rate limiting, error handler) rather than re-implementing it.

## Phase 3 — Code-quality review

- **Strict TypeScript:** no stray `any`, no non-null `!` papering over a real `undefined`, optional
  fields handled.
- **Error handling at boundaries:** network/async calls handle failure the way
  `apiRequest` does (throw/propagate a useful message on non-OK), and callers surface it rather than
  swallowing it.
- **Theming:** colors/spacing/typography come from `mobile/src/theme/` tokens, not hard-coded
  hex/values.
- **Secrets:** no key or secret added to `mobile/.env` or any `EXPO_PUBLIC_*` variable — the Gemini
  key stays server-side only. Flag immediately if violated.
- General smells: dead code, duplicated logic that an existing util/service already covers,
  unhandled edge cases.

## Verdict

End with a clear verdict:

- **`✅ PASS`** — checks green and no blocking issues, or
- **`❌ ISSUES FOUND`** — list each finding, most-severe first, as:
  `path/to/file.ts:line — what's wrong — suggested fix`

Keep it concise and actionable. You verify and recommend; you do not apply the fixes.

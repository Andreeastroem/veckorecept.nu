# Copilot instructions for matveckolistan

These notes teach AI coding agents how to work productively in this repo. Keep it concise, specific, and aligned with how this project actually works.

## Big picture

- Stack: Next.js 15 (App Router) + Convex (DB + server) + Convex Auth + Tailwind 4.
- Auth: Convex Auth protects routes via `middleware.ts` (signin at `/signin`). Providers are wired in `app/layout.tsx` with `ConvexAuthNextjs(Server|Provider)` and client in `components/ConvexClientProvider.tsx`.
- Domain: Users add recipe links; a crawler fetches the page and extracts recipes.
  - Primary flow: `addRecipeToBeCrawled` → cron/action `crawlRecipesAction` → crawler parses HTML/JSON‑LD (`crawler/parser.ts`) → LLM fallback (`crawler/openai/index.ts`) → upsert via `convex/recipeFunctions/upsertFunctions.ts` → mark link crawled.
- Data model (see `convex/schema.ts`):
  - `recipeLinks` (slug, name, link, isCrawled, retries). Indexed by `link` and `isCrawled`.
  - `recipes` (recipeLinkId, slug, name, portionSize). Indexed by `slug`.
  - `ingredients` (name, amount:number[]|null, unit:string|null, recipeId). Indexed by `recipeId`, `name`.
  - `recipeInstructions` (recipeId, recipeLinkId, stepNumber, text).
  - Linking tables: `recipeLinkUsers`, `recipeUsers`. Plus `tags`/`recipeTag`.

## Dev, build, tests

- Run dev (Next + Convex): `npm run dev` (spawns `next dev` and `convex dev`).
  - One‑time setup during dev is handled by `predev` (`setup.mjs`).
- Build/start: `npm run build` / `npm start` (Next only; Convex runs via `convex dev` or a deployment).
- Convex dashboard: `npm run dashboard`.
- Tests: `npm test` (Jest + ts‑jest, node env). Example tests in `nlp-api/__TESTS__/parser.test.ts` and `crawler/parser.test.ts`.

## Conventions and patterns

- Convex functions use the new syntax with validators. Public: `query|mutation|action`. Internal: `internalQuery|internalMutation|internalAction`.
  - Follow the local rules in `.cursor/rules/convex_rules.mdc` (validators, pagination, internal vs public, crons, search indexes).
  - Prefer `withIndex` over `.filter()` when an index exists (e.g., `recipes` by `slug`, `recipeLinkUsers` by `user`).
  - Reference functions via generated refs `api.<file>.<name>` or `internal.<file>.<name>` from `convex/_generated/api`.
- Frontend is App Router under `app/`. Server layout wraps with Convex Auth providers; client components can call `useQuery/useMutation` with generated `api` references.
  - UI components live under `components/ui/` (shadcn-style), and screens under `app/components/*`.
- Crawler strategy (`crawler/index.ts`):
  - Try JSON‑LD first (`findRecipeJsonLD`, `RecipeType` in `crawler/parser.ts`).
  - If missing, sanitize body (`getHTMLBody`) and call OpenAI (`crawlRecipeFromHTMLBody`) which returns `{ingredients, instructions}` conforming to `convex/types.ts` zod schemas.
  - Parsed ingredient lines are normalized via `nlp-api/parser.ts` and unit conversion helpers in `nlp-api/conversion.ts`.
- Upserts (`convex/recipeFunctions/upsertFunctions.ts`):
  - Idempotent per `recipeLinkId` and optional `recipe.id`. Ingredients/instructions are replaced per recipe; unique-vs-existing checks use `inverseIntersection`.

## Integration points

- Auth: `@convex-dev/auth` with domain `CONVEX_SITE_URL`. Middleware enforces auth on `/`, `/server`, `/recipe/(.*)`.
- Convex: Scheduled crons every 12h in `convex/crons.ts` triggering `internal.recipe.crawlRecipesAction`.
- OpenAI: `crawler/openai/index.ts` uses `openai` SDK; expects `OPENAI_API_KEY` in env.
- HTML parsing: `linkedom` for robust DOM parsing.
- Units: `js-quantities` in `nlp-api/conversion.ts`.

## Practical examples

- Add a user‑facing query: create `convex/recipe.ts` query with validators, use `withIndex` when possible, and call it in a client component via `useQuery(api.recipe.yourQuery, args)`.
- Trigger a crawl: call `mutation(api.recipe.addRecipeToBeCrawled, { name, link, slug })`. The cron/action will process uncrawled links; you can also run the internal action from the Convex dashboard.
- Fetch a full recipe by slug: see `getRecipeBySlug` in `convex/recipe.ts` (loads `ingredients` and `recipeInstructions`).

## Environment

Set at least: `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_SITE_URL`, `OPENAI_API_KEY`. For local dev, run `convex dev` alongside Next.

If anything here is unclear or you spot a mismatch with current code, say what needs tightening and propose a quick fix in a PR (small diffs welcome).

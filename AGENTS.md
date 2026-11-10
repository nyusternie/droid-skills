# AGENTS.md — Droid Skills

Guidance for AI agents (and humans) working in this repository.

> [HANDOFF.md](HANDOFF.md) is the historical decision log (genesis, domain
> research, the ethskills.com discovery, and every owner ruling). The working
> rules below are the present-day authority.

## Mission

**droidskills.dev is a SKILL.md server for AI agents working on Android.**
The product is not the website — the product is a set of agent-consumable
skill files in the SKILL.md convention (`name` + a "Use when…" trigger
description), served over plain HTTP at stable URLs:

- `https://droidskills.dev/SKILL.md` — the root index skill AND the FULL
  DIRECTORY of all skills (hand-maintained; owner ruling 2026-11-10 —
  every published skill with its verbatim "Use when…" trigger)
- `https://droidskills.dev/<skill>/SKILL.md` — one file per topic
- `https://droidskills.dev/llms.txt` — the machine-readable catalog

The human-facing pages (`/`, `/<skill>/`, `/about`) are thin, zero-JavaScript
wrappers around the same content. The architecture pattern was discovered
from ethskills.com on 2026-11-09 ("Ethereum Knowledge for AI Agents" — same
structure: root SKILL.md, per-topic SKILL.md, llms.txt). Never invert the
priority: the served `.md` files are first-class, the HTML is the wrapper.

Everything is **public domain (CC0 1.0)** — no rights reserved; agents and
humans may take, remix, and re-serve the files. There is **no funnel**
(owner ruling 2026-11-09: NO email package — no accounts, no forms, no
email field anywhere on the site).

## Repository layout (pnpm workspace)

```
/
├── apps/
│   └── web/                # Astro 7 static site
│       ├── src/content/skills/<slug>.md   # ONE skill per file (filename = slug)
│       ├── src/pages/[slug]/index.astro   # human page for the skill
│       ├── src/pages/[slug]/SKILL.md.ts   # agent-consumed SKILL.md endpoint
│       ├── src/pages/{index,about,404}.astro
│       ├── src/lib/        # pure, fixture-tested helpers (skills.ts,
│       │                   # skill-markdown.ts + *.test.js)
│       └── public/         # SKILL.md, llms.txt, _headers, _redirects,
│                           # robots.txt, favicon.svg
├── .github/workflows/web.yml   # CI + Cloudflare Pages deploy gate
├── pnpm-workspace.yaml     # nodeLinker hoisted + overrides + allowBuilds
└── package.json            # root scripts only; private, no publish
```

- Package manager: **pnpm 11.x** (see `packageManager` in root package.json).
  Do not commit `node_modules`, `yarn.lock`, or `package-lock.json`.
- Node >= 18.17 required (CI runs on the self-hosted runner's Node 24).

## Verified-at-a-glance (re-verify before relying — sources inline)

- **Domain:** `droidskills.dev` — owner-registered 2026-11-09. Cloudflare
  zone active in the rootmyandroid-dedicated account (zone id
  0b60065d403645711acf61917c5468dd). Pages project `droidskills`
  (production branch `master`); subdomain `droidskills.pages.dev` — CLEAN
  and unsquatted (unlike the sibling collisions on
  agenticdroidlife/androidharness). Both custom domains (`droidskills.dev`,
  `www.droidskills.dev`) `status=active` (verified 2026-11-10 UTC).
- **Live (verified 2026-11-10 UTC via `curl --resolve` against Cloudflare
  edge 172.66.47.121 — the dev-box resolver serves stale negatives for
  fresh DNS):** all routes 200 — `/`, `/about/`, the three skill pages,
  `/robots.txt`, the `www` host — and the product content-types are
  correct: `/SKILL.md` + `/<skill>/SKILL.md` as
  `text/markdown; charset=utf-8`, `/llms.txt` as `text/plain`.
- **CI:** self-hosted runner `blackhost-ds` on the blackhost VPS, labels
  `self-hosted,Linux,X64,blackhost` — the `blackhost` label is REQUIRED by
  the workflow's `runs-on` (labels only; a runner without it comes online
  but never picks up a job). Secrets `CLOUDFLARE_API_TOKEN` +
  `CLOUDFLARE_ACCOUNT_ID` set 2026-11-10 (write-only, not retrievable).
  Three consecutive green pipelines as of 2026-11-10 (HANDOFF.md §1).
- **Platform facts verified during skill authoring (2026-11-09):**
  Android 17 = API 37 (developer.android.com/about/versions/17 live;
  /about/releases lists Android 11–17); developer.android.com/tools/logcat
  200 (tokens `-b main|radio|events`, `*:S` confirmed on-page);
  developer.android.com/tools/adb 200 (pairing-port vs connection-port
  distinction confirmed on-page);
  developer.android.com/studio/releases/platform-tools 200;
  developer.android.com/studio/debug/dev-options 200 (Android 11 wireless
  workflow); developer.android.com/about/dashboards live (data footer
  "Last updated 2026-10-06 UTC").
- **Palette:** Android green `#3ddc84` (owner ruling 2026-11-09,
  family-shared with the siblings) on cool paper `#fafcff`; text-safe
  accent `#178247` (4.73:1 on paper); bright green is fills-only.

## Commands

| Task            | Command                    |
| --------------- | -------------------------- |
| Install         | `pnpm install`             |
| Dev server      | `pnpm dev`                 |
| Type-check      | `pnpm check`               |
| Test (all pkgs) | `pnpm test`                |
| Build (static)  | `pnpm build`               |

CI mirrors these exactly: every push to `master` runs check → test:coverage →
build, and only then deploys `apps/web/dist` to Cloudflare Pages (see
`.github/workflows/web.yml`).

## Hard rules for agents

1. **Tests gate deploys.** `pnpm test` and `pnpm build` must both pass
   before anything is deployed to Cloudflare. Never deploy with failing or
   skipped tests, and never delete a test just to make CI green.
2. **Minimum diff.** Preserve existing logic, comments, debug sections, and
   blank-line structure. 1:1 logic parity unless a change is explicitly
   asked for. Treat every file as production-critical.
3. **No guessing — this repo's core discipline.** Every time-sensitive claim
   in a skill file names its retrieval date AND the source page it was
   verified against. A fact that cannot be verified renders as "unknown"
   (or is omitted with a live-verification pointer) — never stated from
   memory. If a claim has no source, do not write it; ask, or verify it
   live first.
4. **Static export, zero JS.** `apps/web` is a purely static Astro site
   (`astro build` → `apps/web/dist/`). No SSR, no adapters, no client-side
   JavaScript anywhere — the skill files are the product and they need no
   runtime. All dynamic/backend functionality is out of scope by design.
   100% static prerendering is also an SEO requirement (owner ruling
   2026-11-10): every page ships as a real file in `dist/` — verify with
   `find apps/web/dist -name '*.html'` after each build.
5. **Skills are the content collection.** One Markdown file per skill in
   `src/content/skills/<slug>.md` (filename = route slug). Frontmatter
   contract (schema in `src/content.config.ts`): `name` (skill-loader name),
   `description` (the "Use when…" trigger — emitted VERBATIM into the served
   SKILL.md, double-quoted by `src/lib/skill-markdown.ts` so trigger text
   can never break the YAML parse), `summary` (short human meta/JSON-LD
   text), `title`, `published`, `updated?`, `order` (shelf order),
   `draft?`. **When adding or removing a skill, update FOUR things:**
   the collection file, the hand-maintained root `public/SKILL.md`,
   `public/llms.txt`, and `public/_headers` (each skill needs its own
   `/<slug>/SKILL.md` content-type line). Human pages update themselves
   from the collection.
6. **Never wipe third-party app data.** Family rule, applies to any device
   work done while authoring/verifying skills: no `pm clear`, no
   `pm uninstall`, nothing data-destroying on any package but our own —
   and even then only with explicit same-turn user confirmation. The
   skills themselves teach read-only inspection; authoring must live up
   to them.
7. **Web styling is 100% Tailwind.** Utilities in markup; shared classes
   (`.btn`, `.card`, `.kicker`, `.pre`, `.skill-body`, …) composed with
   `@apply` in `src/styles/global.css`'s `@layer base/components`; the
   `@theme` block is the single source of truth for tokens. Never inline
   `style=""`, never `<style>` blocks in `.astro` files, never another
   styling system.
8. **Dependencies are pinned — always.** Every specifier in every
   `package.json` EXACT (`4.3.3`, not `^4.3.3`); `workspace:*`/`file:`
   allowed. `.npmrc` carries `save-exact=true`;
   `tools/check-pinned-versions.mjs` runs in `pnpm check` (CI gate) and
   fails on any ranged specifier.
9. **NO external links, NO redirects, NO funnel.** Owner ruling 2026-11-09.
   The site ships zero `<a>` elements pointing at other hosts (sources are
   cited in PLAIN TEXT — "developer.android.com/tools/adb" — never linked),
   and `public/_redirects` must stay rule-free (sneaky redirects are a
   documented spam signal; retired pages 404 naturally). The astro.config
   `externalLinksNewTab` hook remains as a guard for any future exception.
   No email fields, no accounts, no forms, no tracking, no ads.
10. **Sibling naming.** The site never names, links, or references the
    sibling properties (rootmyandroid.com, agenticdroid.life,
    androidharness.com) in page content, meta, structured data, or public
    files — full independence is the SEO-integrity stance. The siblings MAY
    be named in repo meta-docs (AGENTS.md, HANDOFF.md, commit messages) —
    provenance matters for future maintainers.
11. **CI/deploy gotchas** are documented in HANDOFF.md §4 — read them
    before touching `.github/workflows/` or the runner. The standing list:
    the `wranglerVersion` pin trap; `allowBuilds`/`onlyBuiltDependencies`;
    the runner store-dir pin; the runner-clone rsync exclude list; **a
    clone's `bin`/`externals` symlinks must resolve INSIDE its own root**
    (cross-root symlinks make .NET operate on the source runner's config
    state — the root cause behind the androidharness crash-loop);
    `RUNNER_ALLOW_RUNASROOT=1` for root `config.sh`; the `blackhost` label
    requirement; secrets snapshotted at run-creation time (rerun to
    refresh).

## Content notes (skills)

- The three launch skills (owner ruling 2026-11-09): `adb` (pairing /
  authorization / read-only inspection), `android-versions` (the
  API-level landscape), `logcat` (capture / filter / triage).
- New skills follow the ethskills pattern: corrections-first ("what you
  might be wrong about"), dated facts, embedded verification commands.
  Keep each skill standalone — an agent fetches only the one it needs.
- Cross-references between skills use absolute own-host URLs
  (`https://droidskills.dev/<skill>/SKILL.md`) — rule 9 bans only
  OTHER-host links; own URLs are the product.
- The served SKILL.md frontmatter is convention-pure (`name`,
  `description`) — build-time metadata (`summary`, dates, order) never
  leaks into it; dates belong in the BODY as "Verified: …" lines.
- Codename rule: versions are named by number ("Android 17"), never by
  dessert codename — public dessert naming ended with Android 9.

## Brand identity

- Mark: `public/favicon.svg` — a skill file (document with folded corner)
  bearing code slashes, Android green `#3ddc84`. Full-body/geometry-only:
  no typography composited in post.
- Emoji prefix in the header wordmark: 🤖.
- OG card: `apps/web/public/og-image.png` — the skill-file mark beside
  the wordmark, tagline and URL on paper (generated 2026-11-10 via the
  image-generation skill; provenance + QA in HANDOFF.md §3). `og:image`
  meta is restored in `Base.astro`; `twitter:*` meta stays omitted until
  this brand has an X identity (never reuse a sibling's art).

## SEO

- `public/robots.txt` + auto-generated sitemap (`@astrojs/sitemap`).
- JSON-LD: WebSite on `/`, TechArticle per skill page — MUST mirror the
  visible copy exactly (the same title, the same summary, the same dates).
- `<link rel="alternate" type="text/markdown">` on each skill page points
  at its SKILL.md — the agent-discovery hook.

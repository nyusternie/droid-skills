# HANDOFF.md — Droid Skills (droidskills.dev)

Historical decision log for the droidskills.dev build. The present-day
authority for working on this repo is [AGENTS.md](AGENTS.md); this file
explains WHY things are the way they are.

> All sections reflect the verified end-of-session state (2026-11-10 UTC);
> anything that later changes is recorded here with its own dated entry.

---

## 1. Live state (verified 2026-11-10 UTC, all via `curl --resolve` against
Cloudflare edge 172.66.47.121 — never trust the dev-box resolver for fresh
DNS)

- Repo: `git@github.com:nyusternie/droidskills.git` (private, SSH; branch
  `master`; the repo pre-existed from the owner's registration with
  GitHub-default `main`, renamed to `master` 2026-11-09 — same pattern as
  the siblings).
- CI: self-hosted runner `blackhost-ds` (blackhost VPS, labels
  `self-hosted,Linux,X64,blackhost` — the workflow's `runs-on:
  [self-hosted, blackhost]` REQUIRES the `blackhost` label; §4). First
  pipeline (initial commit): both jobs green after one rerun (§4, the
  secrets-snapshot lesson).
- Cloudflare: zone `droidskills.dev` ACTIVE (id
  0b60065d403645711acf61917c5468dd); Pages project `droidskills`
  (production branch `master`); subdomain `droidskills.pages.dev` — CLEAN,
  unsquatted. Both custom domains `status=active`.
- Routes verified (all 200): `/`, `/about/`, `/adb/`, `/android-versions/`,
  `/logcat/`, `/robots.txt`, the `www` host — plus the product itself:
  `/SKILL.md` and all three `/<skill>/SKILL.md` served as
  `text/markdown; charset=utf-8`, `/llms.txt` as `text/plain` (the
  `_headers` rules work). Three skills live (owner ruling 2026-11-09):
  `adb`, `android-versions`, `logcat`. `/og-image.png` (200, image/png,
  436,113 bytes) joined the verified set 2026-11-10 (§3, OG-card entry).
- Secrets set 2026-11-10 (write-only): `CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`.
- Pipelines: four consecutive green as of 2026-11-10 — the initial commit
  (green after one secrets-refresh rerun, §4), the HANDOFF live-state
  push, the session-end AGENTS push, and the OG-card push (run
  42744574629).

## 2. Day-2 ops

- **Add a skill (the daily job):** new file
  `apps/web/src/content/skills/<slug>.md` (filename = slug). Frontmatter:
  `name`, `description` (the "Use when…" trigger — emitted verbatim into
  the served SKILL.md, YAML-double-quoted by `src/lib/skill-markdown.ts`),
  `summary` (short human text), `title`, `published: YYYY-MM-DD`,
  `order` (shelf position), `draft: true` to preview locally without
  shipping. THEN update three public files: `public/SKILL.md` (root index),
  `public/llms.txt`, `public/_headers` (add the `/<slug>/SKILL.md`
  content-type line). Human pages update themselves from the collection.
- **Update a skill:** edit the body, set `updated: YYYY-MM-DD` (frontmatter),
  and refresh the "verified … retrieved YYYY-MM-DD" lines for any fact you
  re-checked live. Facts you did NOT re-check keep their old dates — stale
  dates are honest dates.
- **Verify a fact live (the discipline):** fetch the source page
  (`curl -sL <page>`), confirm the exact claim, and record
  "verified from <page>, retrieved <date>" in the skill body. If the page
  contradicts the claim, fix the claim or print "unknown". Never write a
  fact from memory.
- **Deploy gotchas (all documented with context in §4 / sibling
  HANDOFFs):** wrangler is a root devDependency run via `pnpm exec` (never
  pin `wranglerVersion`); `pnpm-workspace.yaml` carries
  `allowBuilds: {esbuild: true, workerd: false}` +
  `onlyBuiltDependencies: [esbuild]`; the workflow pins the runner's
  pnpm store-dir (`/home/gh-runner/pnpm-store/ds`); runner clones must
  exclude `.runner`, `.credentials*`, `_work`, `.runner_migrated`, `.env`,
  `.path`, must carry REAL `bin.<ver>`/`externals.<ver>` dirs with in-root
  symlinks, and must be registered with the `blackhost` label (§4).
- **Cloudflare API:** all calls from blackhost with the vaulted env file
  (`/root/.cloudflare/rootmyandroid.env`). Verify `cfat_` tokens ONLY at
  `GET /accounts/{account_id}/tokens/verify` — the user-scoped endpoint
  fails them even when valid.
- **DNS checks:** never trust the dev-box resolver for fresh DNS (Tailscale
  MagicDNS serves stale negatives) — verify with `dig @1.1.1.1` or
  `curl --resolve host:443:<edge-ip>`.

## 3. Decision log

### 2026-11-09 — genesis: a fourth satellite modeled on ethskills.com

The owner asked whether a new satellite patterned on **ethskills.com**
would work — initially described as "Android Skills" / "Droid Skills".
Domain research (RDAP availability + Wayback CDX history) across the
candidate set, key results:

- `androidskills.com` / `droidskills.com` — taken, parked, no verified
  for-sale signal.
- `androidskills.dev` — taken by a LIVE concept-incumbent ("curated skills
  for top-shelf Android… launching soon", registered 2026-05-29): a real
  competitor in the exact lane. Avoid.
- `androidskills.xyz` — DISQUALIFIED: 13 Wayback captures 2024–2025 (prior
  tenant, redirect, then lapse) = textbook expired-domain-abuse exposure
  under the Google spam-policy framework.
- `androidskill.md` (Moldova ccTLD, reads literally as "android SKILL.md")
  — cleverest literal match but $184 at 101domain (owner: unaffordable)
  plus unverified ccTLD geo-targeting risk.
- `droidskills.dev` — AVAILABLE, zero Wayback captures ever, global gTLD,
  developer-native TLD, normal price band, "Droid" already sanctioned
  family vocabulary via agenticdroid.life. **Owner registered it.**

### 2026-11-09 — the ethskills.com discovery (product reframed)

Fetching ethskills.com live revealed it is NOT a blog — it is a
**SKILL.md server**: a root index skill (`/SKILL.md`, YAML frontmatter
`name` + a "Use when…" trigger `description`, body of dated corrections to
stale model knowledge with embedded verification commands), per-topic
skills at `/<skill>/SKILL.md`, plus `/llms.txt`. The product became: serve
skill files for AI agents working on Android, with thin human-facing
HTML wrappers — the network's existing prerender-`.md` machinery promoted
from alternate-format to first-class product.

### 2026-11-09 — owner rulings

1. **Product shape confirmed** — root `/SKILL.md` + per-topic
   `/<skill>/SKILL.md` + `/llms.txt` + thin HTML wrappers.
2. **NO MORE EMAIL PACKAGE** — this satellite has no funnel at all (no
   accounts, no email field, no forms). Sibling evidence the same day:
   the androidharness repo's `public/_redirects` comment references "the
   retired /package funnel" — the retirement was already network practice.
3. **Three launch skills:** `adb`, `android-versions`, `logcat`.
4. **GREEN palette** — Android green `#3ddc84` (family-shared; the
   siblings' sites had already been re-themed to the same green by their
   teams before this build cloned the base).

### 2026-11-09 — build log

- Base: cloned from the androidharness repo (itself evolved since its own
  handoff — an "Agency for Agentic Android" pivot with agency assets, green
  re-theme, CC0 footer dedication). The clone was scrubbed: agency assets
  (hero/roster images, downloads-*.svg, art prompts, profiles.astro,
  og-image.png) deleted; the product layer (pages, skills collection,
  endpoints, public files) written fresh for the skills model; the proven
  shell (config, workflow, pnpm files, lib pattern, Tailwind setup)
  preserved with 1:1 logic parity.
- Schema: skills collection with `name`/`description` (agent convention,
  emitted verbatim) + `summary`/`title`/`published`/`updated`/`order`/
  `draft` (build-time only).
- Served SKILL.md assembly: `src/lib/skill-markdown.ts` —
  `buildSkillMarkdown()` emits convention-pure frontmatter with
  YAML-double-quoted scalars (unit-tested; a broken YAML parse is a broken
  product). The root `public/SKILL.md` is hand-maintained in the same
  convention (plain-style scalars, ethskills-style).
- CI caught a real regression: the `withoutDrafts` rewrite dropped the `!`
  (it kept drafts, dropped published skills) — the family fixtures earned
  their keep; fixed with a one-character minimum diff.
- Gate chain (local): `pnpm check` 0 errors/0 warnings; `pnpm test` 8/8;
  `pnpm build` 6 pages + 3 SKILL.md endpoints; emitted HTML carries ZERO
  external `<a href="http…">` anchors (policy satisfied by construction).

### 2026-11-10 — OG card: this brand's own art (follow-up closed)

- Mechanics: the image-generation skill (`~/.pi/agent/skills/image-generation`),
  model `gemini-3-pro-image-preview`, ONE render ($0.1422, 2015 tokens —
  cost discipline kept). Raw 1424x752 render staged at
  `~/Downloads/droidskills-og-v1.jpg`, center-cropped to the exact
  1200x630 og-image spec, shipped as `apps/web/public/og-image.png`
  (436,113 bytes).
- Composition: left, the favicon skill-file mark (document + folded
  corner + code slashes, brand #3ddc84); right, the wordmark "Droid
  Skills" (ink #0f172a), the tagline "Skill files for AI agents working
  on Android" (text-safe accent #178247), and "droidskills.dev" (ink).
  NO 🤖 in the art — AGENTS.md scopes the emoji prefix to the header
  wordmark, and an emoji glyph is not OCR-verifiable.
- QA (skill doctrine: no binaries in context, OCR programmatically):
  tesseract on the full render and on the final crop — all three text
  lines and the "</>" read back. The single ambiguity (tesseract read
  "AI" as "Al") was resolved by connected-component glyph geometry on a
  green-isolated bitmap: the render's font draws capital-I and
  lowercase-l IDENTICALLY (the disputed bar is 11px wide / 47px tall;
  the known-l glyphs in "Skill"/"files" are 11px wide / 46–48px tall,
  areas within ±12). The reading is therefore OCR-inconclusive BY
  CONSTRUCTION — no distinguishable defect exists. Final visual QA is
  the owner eyeball via the live URL, per skill doctrine.
- Wiring: `Base.astro` restores `og:image` + width/height/alt (absolute
  URL via `Astro.site`, the same pattern as `canonical`); `twitter:*`
  meta stays omitted — X identity still pending (§5).
- Gate chain: `pnpm check` 0 errors/0 warnings (the 10 ts(6385) 'z is
  deprecated' items in content.config.ts roll up under hints — astro
  check display quirk, pre-existing on master); `pnpm test` 8/8;
  `pnpm build` 6 pages; dist verified — og:image meta on all 6 HTML
  pages, zero real twitter meta tags, the only http anchors are the
  own-host skill cross-references (AGENTS.md rule 9 carve-out).
- Deploy: run 42744574629, both jobs success; live-verified via
  `curl --resolve` against edge 172.66.47.121 — `/og-image.png` 200
  image/png 436,113B, the homepage serves all four og:image meta tags.
- Verbatim generation prompt (the source art — derivatives are free),
  staged as `~/Downloads/droidskills-og-v1.txt`:

```text
Flat vector-style Open Graph social card for a developer website. Aspect ratio: 1.91:1 wide landscape banner (1200x630). Solid cool off-white background #FAFCFF, perfectly flat, no texture.

Left third, vertically centered: a large minimalist line-art icon of a single document file with a folded top-right corner, drawn with thick rounded uniform strokes in bright Android green #3DDC84, and centered inside the document a pair of angle-bracket code slashes "</>" drawn in the same green stroke style.

Right two-thirds, left-aligned, vertically centered, three stacked lines of text:
Line 1: "Droid Skills" in very bold modern geometric sans-serif, dark navy ink #0F172A.
Line 2: "Skill files for AI agents working on Android" in medium-weight sans-serif, deep green #178247.
Line 3: "droidskills.dev" in small regular sans-serif, dark navy #0F172A.

Clean composition with generous whitespace. No border, no shadow, no gradient, no glow, no watermark, no photorealism, no 3D, no robot, no mascot, no emoji, no icons other than the one document icon described, and no text anywhere other than the three lines described.
```

## 4. Infrastructure (all steps verified as landed)

1. GitHub repo push (initial commit, 2026-11-09).
2. Self-hosted runner `blackhost-ds`, cloned from the `web` instance.
   **This build hit and fixed the REAL root cause behind the
   androidharness clone's crash-loop gotcha — and it is bigger than the
   sibling doc recorded:**
   - A runner clone must contain the REAL versioned binaries:
     `bin.<ver>/` and `externals.<ver>/` are real directories inside each
     runner root (created by self-update); `bin` and `externals` are
     symlinks that must point INSIDE the clone's own root. NEVER symlink a
     clone's `bin` across runner roots: .NET resolves the assembly's
     physical path, so the listener reads/writes the SOURCE runner's
     config state — `config.sh remove`/`configure` then collide with it
     ("already configured", "Uninstall service first", "A session for this
     runner already exists"). Fix: `cp -a bin.<ver> externals.<ver>` into
     the clone and `ln -sfn bin.<ver> bin` (same for externals).
   - `config.sh` as root needs `RUNNER_ALLOW_RUNASROOT=1` (not set
     globally on blackhost; the wrapper exits "Must not run with sudo").
   - Unwind order for a failed setup: `svc.sh stop` → `svc.sh uninstall`
     → `config.sh remove --token …` (remove REFUSES while its own service
     record exists; the `.service`/`.env`/`.path` files it checks are
     svc.sh/config.sh artifacts recreated by every attempt — delete them
     manually if the normal unwind desynced).
   - `svc.sh` itself embeds the source runner's identity: re-brand BOTH
     `SVC_NAME` and `SVC_DESCRIPTION` lines (and `runsvc.sh`'s path/name)
     — otherwise status/install operate on the source runner's service.
   - The rsync exclude list from the androidharness doc
     (`.runner`, `.credentials*`, `_work`, `.runner_migrated`, `.env`,
     `.path`) stays valid; `env.sh`, `runsvc.sh`, `config.sh`, `svc.sh`
     are rsync'd and re-branded as above.
   - Register with labels `self-hosted,Linux,X64,blackhost` — without
     `blackhost` the runner comes online but never picks up jobs
     (`runs-on` matches labels only).
3. CI secrets from the blackhost vault via SSH pipe. **New lesson:**
   secrets are snapshotted at workflow-RUN creation time — a run created
   BEFORE the secrets existed fails its deploy with "necessary to set a
   CLOUDFLARE_API_TOKEN environment variable" even after the secrets are
   set; `gh run rerun --failed` refreshes the snapshot (verified: rerun
   green 2026-11-10). Prefer setting secrets BEFORE the first push.
4. Domain attach: CNAMEs `droidskills.dev` + `www` →
   `droidskills.pages.dev` (proxied); POST /domains both → stuck
   `pending/pending`; the PATCH-retry kicked the background job — the
   response body says "error" while polling shows `active/active` seconds
   later (the exact sibling quirk, third time observed).
5. `curl --resolve` live verification of every route + content-type
   (§1) — all green.

## 5. Follow-ups (next-session queue)

- **More skills** — candidates: gradle-build (AGP/Kotlin version matrix),
  apk-analysis (aapt/apkanalyzer inspection), screen-capture (screencap /
  screenrecord), app-signing (keystore discipline), play-store-policy
  (targetSdk gates, declaration forms). Each needs the live-verification
  pass before writing.
- **X identity** — owner decision pending; until then `twitter:*` meta
  stays omitted.
- **Green-family differentiation** — all sibling properties now share
  `#3ddc84`; verify the treatments stay visually distinct (Droid Skills
  uses green-on-paper with the 🤖 wordmark and skill-file mark).
- **ethskills.com watch** — if the pattern-source site adds new skill
  types, consider Android analogs.
- **llms.txt spec review** — the file follows the llmstxt.org convention
  informally; review against the spec on a future pass.

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

- Repo: `git@github.com:nyusternie/droid-skills.git` (renamed AGAIN
  2026-11-10 — owner ruling, same day as the rename/revert arc:
  `droidskills` → `droid-skills`; still TLD-agnostic per the 2026-11-10
  ruling, now with the hyphen;
  repo id 1451984060 preserved, the old name redirects (web + git —
  `gh api repos/nyusternie/droidskills` follows to `droid-skills`,
  `git ls-remote` on the old SSH URL exits 0), runner `blackhost-ds`
  verified online post-rename with all four required labels; PUBLIC —
  re-verified 2026-11-10 via `gh api repos/nyusternie/droid-skills`; the
  2026-11-09 "private" record is stale; SSH; branch
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
- Pipelines: thirteen consecutive green + two superseded cancellations as of
  2026-11-10 (verified via `gh run list` — 15 total runs, NO failure
  conclusion ever) — the initial commit (green after one secrets-refresh rerun,
  §4), the HANDOFF live-state push, the session-end AGENTS push, the
  OG-card push (run 42744574629), the OG-card docs push (run 42744995981),
  the contributions push (run 42747094870 — carried the starting-prompt
  commit too: its own run 42746932708 was cancelled-in-progress by it
  under web.yml's concurrency design, not a failure), the docs push (run
  42747529707), the root-.md push (run 42748926333 — routing later
  REVERSED, see the routing-arc entry below), and the directory push (run
  42750527008 — carried the revert commit too: the revert's own run
  42750376159 was cancelled-in-progress by it, same concurrency design),
  the rename-references push (run 42751397221), the branding push (run
  42902490115), and the rule-4-amendment push (run 42904833811). The
  session-closing docs-sync push adds one more run after this record was
  written (expected green — verify next session).

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

### 2026-11-10 — quick wins closed: llms.txt v2 spec review + ethskills watch; starting prompt shipped (owner ruling)

- **llms.txt v2 spec review** (verified from llmstxt.org — "The
  /llms.txt file, v2" — retrieved 2026-11-10): `public/llms.txt` is
  FORMAT-COMPLIANT — H1 (the only required section), blockquote summary,
  H2 file lists as `- [name](url): details`, the conventional "Optional"
  section. ONE gap found and fixed: v2 recommends pages link their
  covering llms.txt via `rel="describedby"` — `Base.astro` now emits
  `<link rel="describedby" href="/llms.txt">` on every page (the
  `rel="alternate" type="text/markdown"` skill-page links were already
  spec-shaped).
- **ethskills watch** (verified from ethskills.com /SKILL.md /llms.txt /
  homepage HTML, retrieved 2026-11-10): the pattern-source has grown to
  ~20 skills and its homepage now leads with a "Prompt" block under the
  hero (label + pasteable line + a client-side-JS copy button), followed
  by a "Persistent Setup" per-tool install section; the root index gained
  a "What to Fetch by Task" routing table.
- **Owner ruling (2026-11-10): droidskills.dev MUST offer a starting
  prompt just below the landing hero, like ethskills.com.** SHIPPED:
  `index.astro` gains "The starting prompt" section directly under the
  hero — the pasteable line "Read https://droidskills.dev/SKILL.md and
  follow it before building, debugging, or inspecting anything on
  Android." (trigger verbs mirror the root SKILL.md description). FORCED
  DEVIATION FROM THE PATTERN: the copy button is client-side
  JavaScript — banned sitewide by AGENTS.md rule 4 — so the block uses
  `select-all` (`user-select: all`, pure CSS; verified emitted in
  `dist/_astro/Base.*.css`) and the explainer says one click selects the
  line.
- Gate chain: `pnpm check` 0 errors/0 warnings (10 pre-existing ts(6385)
  hints); `pnpm test` 8/8; `pnpm build` 6 pages; dist verified — prompt
  on the homepage, describedby on all 6 HTML files, the only script type
  is application/ld+json (zero client JS), zero external anchors.
- Deploy: the push's own run (42746932708) was cancelled-in-progress by
  the following push (web.yml concurrency, by design); run 42747094870
  carried this commit and went green. Live-verified via `curl --resolve`
  against edge 172.66.47.121: prompt + heading + describedby on `/`,
  `/og-image.png` still 200 image/png.

### 2026-11-10 — contributions package (owner ruling: contributions are a big part of repo engagement)

- Files added: `CONTRIBUTING.md` (human entry point: ways to contribute,
  the verification discipline, the four-file skill rule, the PR gates,
  the surprising content rules, the CC0 dedication), `CODE_OF_CONDUCT.md`
  (Contributor Covenant v2.1 fetched VERBATIM from contributor-covenant.org
  — sha256-verified copy — with the single sanctioned template
  substitution: enforcement contact = the GitHub issue tracker, because
  the no-funnel ruling means no email address), `LICENSE` (CC0 1.0 legal
  code fetched VERBATIM from
  creativecommons.org/publicdomain/zero/1.0/legalcode.txt,
  sha256-verified). `README.md` gains a Contributing section pointing at
  all three.
- Visibility fact surfaced by the work: the repo is PUBLIC (verified
  2026-11-10; §1 corrected) — public issues/PRs are genuinely possible.
- The four files are the GitHub community-profile core set; templates
  remain queued (§5).
- Deploy: run 42747094870 green (this commit changed no site files —
  README/LICENSE/CoC/CONTRIBUTING live at the repo root, not in
  `apps/web/dist`).

### 2026-11-10 — routing arc closed: root-.md ruling landed, then REVERSED by owner ruling; nested /<slug>/SKILL.md restored; static-for-SEO enshrined

- The root-.md migration (f02c76e) shipped and was live-verified (root
  endpoints 200 text/markdown, nested 404, dist 100% static files).
  During post-deploy verification one anomaly appeared: `/logcat/SKILL.md`
  kept returning 200 with `cf-cache-status: DYNAMIC` + `cache-control:
  no-store` — a Pages-origin propagation straggler, not edge cache; still
  200 at +3.5 min when the reversal landed (the revert made it moot: the
  URL serves the same content again).
- **Owner ruling (2026-11-10): maintain the pre-existing `/<slug>/SKILL.md`
  pattern** — the same-day root-.md ruling is REVERSED. Reverted as
  f8d42a0 (git rename-tracking confirmed the endpoint moved back, 53%
  similarity). The static-for-SEO requirement was NOT reversed — enshrined
  permanently in AGENTS.md rule 4 ("every page ships as a real file in
  `dist/` — verify with `find apps/web/dist -name '*.html'` after each
  build").
- Revert live-verified: nested endpoints 3× 200 text/markdown, root .md
  paths 3× 404, gates 8/8 tests + 0 errors/0 warnings.

### 2026-11-10 — full directory of ALL skills at /SKILL.md (owner ruling)

- **Owner rulings (2026-11-10): a FULL DIRECTORY of ALL SKILLS is
  required; it lives at `https://droidskills.dev/SKILL.md`** (a dedicated
  `/skills/` human page was considered and is superseded by this ruling).
  Shipped as 5b11fd9: `## Skills` expanded into `## The full directory of
  ALL skills` — slug-keyed headings, each skill's "Use when…" trigger
  VERBATIM from its collection frontmatter, stable URLs (skill file +
  human page), published dates; all existing hooks and verified dates
  preserved. AGENTS.md mission bullet + llms.txt Optional line updated to
  name the directory. Live-verified: the directory section serves at
  /SKILL.md.
- An llms-full.txt-style agent catalog (full concatenated content of all
  skills in one file) remains an available future addition — queued in §5,
  build only if the owner wants it.

### 2026-11-10 — repo renamed nyusternie/droidskills → nyusternie/droidskills.dev (owner ruling; REVERTED same day — see the next entry)

- `gh repo rename` executed and verified: repo id 1451984060 preserved
  (issues/secrets/Actions/runners follow the immutable id), the old name
  redirects (web + git), visibility public, default branch `master`.
- Runner `blackhost-ds` verified ONLINE post-rename with all four required
  labels — CI unbroken.
- Local remote updated to `git@github.com:nyusternie/droidskills.dev.git`;
  CODE_OF_CONDUCT.md enforcement URL + this file's §1 updated (the only
  two repo-name references in tracked files, per grep).
- Local folder on ayumi: renamed to `/root/Workspace/droidskills.dev`
  immediately after this commit as the session's final action (Pi restart
  + session fork per owner note). Next session MUST verify: the path
  exists, `git status` clean, `git remote -v` =
  `git@github.com:nyusternie/droidskills.dev.git`.

### 2026-11-10 — repo rename REVERTED: nyusternie/droidskills.dev → nyusternie/droidskills (owner ruling)

- **Owner ruling (2026-11-10): the repo name reverts to `droidskills`** —
  the owner is NOT 100% sure the .dev TLD will always be the one (a move
  to another TLD is possible depending on community feedback), so the repo
  name stays TLD-agnostic. The SITE domain is unchanged by this ruling —
  `droidskills.dev` remains the live zone/Pages custom domain; no other
  domain is registered at this time.
- `gh repo rename droidskills -R nyusternie/droidskills.dev --yes`
  executed and verified via `gh api repos/nyusternie/droidskills`: repo id
  1451984060 preserved (issues/secrets/Actions/runners follow the
  immutable id), default branch `master`, visibility public.
- Runner `blackhost-ds` verified ONLINE post-revert (status=online,
  busy=false) with all four required labels — CI unbroken.
- Local remote on ayumi updated to
  `git@github.com:nyusternie/droidskills.git` (fetch verified exit 0);
  CODE_OF_CONDUCT.md enforcement URL + this file's §1 reverted (again the
  only two repo-name references in tracked files, per grep).
- Local folder on ayumi: verified 2026-11-10 — the checkout lives at
  `/root/Workspace/droidskills` (the only droidskills* path in
  /root/Workspace; the previous entry's `/root/Workspace/droidskills.dev`
  record is stale — the folder on disk carries the old name, which now
  matches the repo again).

### 2026-11-10 — branding + UX rulings: green-robot favicon, /skills page, display font, zero-JS copy blocks, animated landing

- **Owner rulings (2026-11-10), all landed in one pass:**
  1. `SKILL.md` is the FIRST link in the header nav.
  2. The `curl` commands MUST be copiable — implemented as the zero-JS
     `CopyBlock.astro` (rule 4 unchanged: no clipboard JS anywhere; one
     click selects the whole command via `user-select: all`, the command
     is the only text node in the `<code>` so select-all can never capture
     a prompt glyph). Used on the landing hero + every skill page's fetch
     card. The starting-prompt block already worked this way (`select-all`).
  3. NO hashtag links for skills — `/skills/` is a real page (the full
     shelf, from the collection); the landing keeps only a preview
     ("Fresh off the shelf") linking to it. The 2026-11-10 "full directory
     at /SKILL.md supersedes a dedicated /skills page" note is REVERSED
     for the HUMAN page only — the root SKILL.md full directory stands.
     The 404's "Back to the shelf" now points at /skills/.
  4. The favicon MUST be a green robot — new mark shipped (rounded-square
     face, two antennae, wide-set eyes, small smile, #3ddc84; shared
     geometry in `public/favicon.svg` + `Robot.astro`); supersedes the
     2026-11-09 skill-file mark. AGENTS.md brand identity updated.
  5. The landing page was TOO BORING — graphics + animation shipped,
     ALL CSS-only (rule 4): animated robot (bob/blink/antenna-wiggle),
     blueprint-grid hero backdrop, pulsing glow, a decorative terminal
     that types the two real first fetches with steps() typewriter +
     fade-in output (real frontmatter prefixes) + blinking caret, card
     hover-lift. `prefers-reduced-motion: reduce` lands everything in its
     final state instantly.
  6. Header title + icon MUCH BIGGER, in a unique droid-ish font —
     Orbitron 800 self-hosted woff2 (latin subset, 6,740 bytes, from
     fonts.gstatic.com 2026-11-10; SIL OFL 1.1 verified, full text at
     `public/fonts/Orbitron-OFL.txt`); `--font-display` token →
     `font-display` utility on the wordmark + every page h1.
  7. Hero headline replaced with the owner's copy: "Step-by-step
     instructions for your Android to do just about ANYTHING!" (the old
     "Android knowledge, in the format agents actually use." is retired).
  8. Footer split: site line left, "Public domain, no rights reserved
     (CC0 1.0)." RIGHT-aligned (owner ruling).
  9. README: OG banner at the head + refreshed details (routes, brand,
     TLD-agnostic repo name).

### 2026-11-10 — rule 4 AMENDED: JavaScript allowed as enhancement ONLY; static stays absolute; TRUE one-click copy shipped

- **Owner ruling (2026-11-10, same day as the branding pass): amend rule
  4 — client-side JavaScript IS allowed, BUT the site MUST remain
  "static".** The amendment as written into AGENTS.md rule 4: no SSR, no
  adapters (unchanged and absolute); JS only as hand-written vanilla
  progressive enhancement shipped as a static asset; every page MUST stay
  fully usable with JavaScript disabled (all content readable, every
  JS-wired feature has a no-JS path); JavaScript never gates content.
  The 100% static prerendering SEO requirement + the
  `find apps/web/dist -name '*.html'` verification are unchanged.
- Shipped: `public/js/copy.js` (the ONLY script on the site, loaded with
  `defer` from Base.astro) + a `Copy` button on every `CopyBlock.astro`.
  Progressive enhancement by construction: the button renders with
  `hidden`; the script reveals it and wires `navigator.clipboard.writeText`
  (success → "Copied!" flash; denial/insecure context → selects the
  command instead). JavaScript off → the button never appears and the
  original click-to-select path (`user-select: all`, hint chip) carries
  the feature — 1:1 parity with the pre-amendment UX, plus the button.
  The starting-prompt block was upgraded from `<pre select-all>` to a
  CopyBlock in the same pass (it is the text users actually paste).
- Every stale "zero JavaScript" claim corrected in the same pass (site
  About page content, Base/index/skills/404/Robot/CopyBlock comments,
  global.css comments, README brand line). Historical HANDOFF entries
  stand as written — they record what was true on their dates.

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

- **More skills** — OWNER CONFIRMED 2026-11-10: the NEXT session starts
  adding new skills. Candidates: gradle-build (AGP/Kotlin version matrix),
  apk-analysis (aapt/apkanalyzer inspection), screen-capture (screencap /
  screenrecord), app-signing (keystore discipline), play-store-policy
  (targetSdk gates, declaration forms), plus the ethskills analogs
  (testing, security, qa). Each needs the live-verification pass before
  writing.
- **X identity** — owner decision pending; until then `twitter:*` meta
  stays omitted.
- **Green-family differentiation** — all sibling properties now share
  `#3ddc84`; verify the treatments stay visually distinct (Droid Skills
  uses green-on-paper with the robot wordmark and the green-robot favicon
  — both shipped 2026-11-10, see the branding entry in §3).
- **ethskills.com watch** — checked 2026-11-10 (§3): pattern-source at
  ~20 skills; the starting-prompt analog is shipped. Remaining structural
  analogs to consider on future passes: a "What to fetch by task" routing
  table in the root SKILL.md (once the shelf is big enough to route) and
  a "Persistent setup" per-tool install section (each tool's instructions
  need a live-verification pass first). The feedback-skill pattern has NO
  analog here — the no-funnel ruling stands. Re-check on the next skills
  pass.
- **Community-profile completeness** — the core four are in place
  (README, CONTRIBUTING.md, CODE_OF_CONDUCT.md, LICENSE). Consider GitHub
  issue templates and a PR template on a future pass; SECURITY.md needs a
  contact decision first (the no-email constraint that shaped the CoC).
- **llms-full.txt-style agent catalog** — concatenated full content of all
  skills in one file, per the llms.txt convention's companion-file
  pattern; build only if the owner wants it (the full directory at
  /SKILL.md may suffice).

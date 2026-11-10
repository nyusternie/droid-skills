# CONTRIBUTING.md — Droid Skills

Contributions are a first-class part of this project. The product is the
set of skill files served at droidskills.dev — verified, dated corrections
to stale model knowledge for AI agents working on Android — and every
contribution must hold the same bar.

The complete rulebook for working in this repo is [AGENTS.md](AGENTS.md)
(written for AI agents; every rule in it applies to human contributors
too). This file is the human entry point.

## Ways to contribute

1. **Report a wrong or stale fact** — the highest-value contribution. If a
   skill states something the live platform contradicts, open an issue
   with the skill name, the claim, the source page that contradicts it,
   and the date you checked. Dated evidence beats reputation.
2. **Propose a new skill** — open an issue with the topic and the trigger
   ("Use when…") before writing the full file; the scope decision comes
   first. New skills follow the pattern of the existing three (`adb`,
   `android-versions`, `logcat`): corrections-first, dated facts,
   embedded verification commands, standalone — an agent fetches only the
   one it needs.
3. **Fix copy, typos, tooling, tests** — open a PR directly. Small diffs
   welcome.
4. **Improve the site shell** — open a PR. The hard rules: zero client-side
   JavaScript, Tailwind-only styling, pinned dependencies, tests gate
   deploys.

## The verification discipline (mandatory for fact changes)

- Every time-sensitive claim names its **retrieval date** AND the **source
  page** it was verified against — e.g. "verified from
  developer.android.com/tools/adb, retrieved 2026-11-09".
- A fact that cannot be verified renders as **unknown** (or is omitted
  with a live-verification pointer) — never stated from memory.
- If you update a fact, update its date. Facts you did not re-check keep
  their old dates — stale dates are honest dates.

## Adding or removing a skill — FOUR files change together

1. `apps/web/src/content/skills/<slug>.md` — one Markdown file per skill
   (filename = route slug; frontmatter contract in
   `apps/web/src/content.config.ts`).
2. `apps/web/public/SKILL.md` — the hand-maintained root index skill.
3. `apps/web/public/llms.txt` — the machine-readable catalog.
4. `apps/web/public/_headers` — each skill needs its own
   `/<slug>.md` content-type line.

Human pages update themselves from the collection.

## Before opening a PR

Run the same gates CI runs, from the repo root:

    pnpm install
    pnpm check    # astro check + pinned-dependency audit
    pnpm test     # unit tests
    pnpm build    # static build must succeed

Never delete a test to make a check pass. Minimum diff: preserve existing
logic, comments, and structure — treat every file as production-critical.

## Content rules that surprise people

- **No external links in site content.** Sources are cited in PLAIN TEXT
  ("developer.android.com/tools/adb"), never hyperlinked. Cross-references
  between skills use absolute own-host URLs — those ARE the product.
- **No sibling naming** in page content, meta, structured data, or public
  files. (Repo meta-docs like AGENTS.md and HANDOFF.md may name them.)
- **No funnel** — no accounts, no forms, no email fields, no tracking, no
  ads. Do not add one.
- **Versions by number**, never by dessert codename ("Android 17").

## License

Everything here is public domain — CC0 1.0, no rights reserved (see
[LICENSE](LICENSE)). By contributing, you dedicate your contribution to
the public domain under the same terms. If you cannot do that (for
example, your employer's agreement forbids it), please do not submit the
contribution.

## Code of conduct

This project follows the Contributor Covenant — see
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

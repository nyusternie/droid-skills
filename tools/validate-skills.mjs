// tools/validate-skills.mjs — validates every served SKILL.md against the
// Agent Skills specification (agentskills.io/specification, reviewed
// 2026-11-11) using the spec's official reference validator, skills-ref
// (pinned root devDependency). Runs AFTER `pnpm build` — it validates the
// dist/ output agents actually fetch, not the source. Wired into CI as its
// own step after the Build step.
//
// Per-skill directories (apps/web/dist/<slug>/SKILL.md) validate directly —
// name matches directory by construction. The root index SKILL.md (served
// at /SKILL.md, name "droidskills") lives directly in dist/, whose name
// does NOT match, so it is staged in a temp dir of its own name first (the
// spec requires directory name == skill name).
import { execFileSync } from 'node:child_process'
import {
  readdirSync,
  readFileSync,
  mkdtempSync,
  mkdirSync,
  copyFileSync,
  rmSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

const dist = join('apps', 'web', 'dist')

// Per-skill dirs: apps/web/dist/<slug>/SKILL.md
const targets = readdirSync(dist, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => join(dist, e.name))
  .filter((dir) => readdirSync(dir).includes('SKILL.md'))

// Root index: stage as <tmp>/<name>/SKILL.md
const indexSrc = join(dist, 'SKILL.md')
const name = readFileSync(indexSrc, 'utf8').match(/^name:\s*"?([^"\n]+?)"?\s*$/m)?.[1]
if (!name) {
  console.error(`Could not parse name from ${indexSrc}`)
  process.exit(1)
}
const staged = join(mkdtempSync(join(tmpdir(), 'skills-ref-')), name)
mkdirSync(staged, { recursive: true })
copyFileSync(indexSrc, join(staged, 'SKILL.md'))
targets.push(staged)

let failures = 0
for (const target of targets) {
  try {
    execFileSync('pnpm', ['exec', 'skills-ref', 'validate', target], { stdio: 'inherit' })
  } catch {
    failures++
  }
}
rmSync(dirname(staged), { recursive: true, force: true })

if (failures) {
  console.error(`${failures} skill(s) failed skills-ref validation`)
  process.exit(1)
}
console.log(`All ${targets.length} SKILL.md files pass skills-ref validation`)

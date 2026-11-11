// src/lib/skill-markdown.ts — assembles the raw SKILL.md body served at
// /<slug>/SKILL.md (endpoint: src/pages/[slug]/SKILL.md.ts). The root index
// (public/SKILL.md) is hand-maintained in the same convention. Pure and
// fixture-tested (src/lib/skill-markdown.test.js) so the endpoint stays
// thin. The frontmatter follows the agent skill-loader convention — `name`
// + `description` (the "Use when…" trigger) — emitted as double-quoted YAML
// scalars so trigger text can never break the parse (AGENTS.md rule 3).
// `license` is the Agent Skills specification's optional field
// (agentskills.io/specification, reviewed 2026-11-11): the whole site is
// public domain (CC0 1.0, owner ruling 2026-11-09), so it is emitted as a
// constant — never configurable per skill.
export interface SkillMarkdownInput {
  name: string
  description: string
  body: string
}

/** The site-wide license (owner ruling 2026-11-09: public domain CC0 1.0). */
export const SKILL_LICENSE = 'CC0-1.0'

/** Escape a string for embedding in a double-quoted YAML scalar. */
export function yamlDoubleQuoted(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function buildSkillMarkdown({ name, description, body }: SkillMarkdownInput): string {
  return [
    '---',
    `name: ${yamlDoubleQuoted(name)}`,
    `description: ${yamlDoubleQuoted(description)}`,
    `license: ${SKILL_LICENSE}`,
    '---',
    '',
    body.trimEnd(),
    '',
  ].join('\n')
}

// src/lib/skill-markdown.ts — assembles the raw SKILL.md body served at
// /<slug>.md (endpoint: src/pages/[slug].md.ts). The root index
// (public/SKILL.md) is hand-maintained in the same convention. Pure and
// fixture-tested (src/lib/skill-markdown.test.js) so the endpoint stays
// thin. The frontmatter follows the agent skill-loader convention — `name`
// + `description` (the "Use when…" trigger) — emitted as double-quoted YAML
// scalars so trigger text can never break the parse (AGENTS.md rule 3).
export interface SkillMarkdownInput {
  name: string
  description: string
  body: string
}

/** Escape a string for embedding in a double-quoted YAML scalar. */
export function yamlDoubleQuoted(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function buildSkillMarkdown({ name, description, body }: SkillMarkdownInput): string {
  return [
    '---',
    `name: ${yamlDoubleQuoted(name)}`,
    `description: ${yamlDoubleQuoted(description)}`,
    '---',
    '',
    body.trimEnd(),
    '',
  ].join('\n')
}

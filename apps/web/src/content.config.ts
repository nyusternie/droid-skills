// apps/web/src/content.config.ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// The skills collection — one Markdown file per skill in
// src/content/skills/ (filename = route slug: <slug>.md → /<slug>/ for the
// human page and /<slug>/SKILL.md for the agent-consumed skill file).
// `name` + `description` follow the agent skill-loader convention
// (description is the "Use when…" trigger string) and are emitted VERBATIM
// into the served SKILL.md frontmatter by src/lib/skill-markdown.ts.
// `summary` is the short human-facing description (meta + JSON-LD).
// `title`, `published`, `updated`, `order`, `draft` are build-time
// metadata for the human pages only — they never leak into the skill file.
const skills = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/skills' }),
  schema: z.object({
    name: z.string().min(1),
    description: z.string().min(10),
    summary: z.string().min(10),
    title: z.string().min(1),
    published: z.date(),
    updated: z.date().optional(),
    order: z.number().int(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { skills }

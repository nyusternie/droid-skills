// src/pages/[slug]/SKILL.md.ts — serves the agent-consumed skill file at
// /<slug>/SKILL.md. Body assembly lives in src/lib/skill-markdown.ts
// (unit-tested in src/lib/skill-markdown.test.js) so this endpoint stays
// thin. The content-type is enforced in production by public/_headers
// (static hosting serves only the body of an endpoint's Response).
import { getCollection } from 'astro:content'
import type { APIRoute, GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { withoutDrafts } from '../../lib/skills'
import { buildSkillMarkdown } from '../../lib/skill-markdown'

export const getStaticPaths: GetStaticPaths = async () => {
  const skills = withoutDrafts(await getCollection('skills'))
  return skills.map((skill) => ({ params: { slug: skill.id }, props: { skill } }))
}

export const GET: APIRoute = ({ props }) => {
  const { skill } = props as { skill: CollectionEntry<'skills'> }
  return new Response(
    buildSkillMarkdown({
      name: skill.data.name,
      description: skill.data.description,
      body: skill.body ?? '',
    }),
    { headers: { 'content-type': 'text/markdown; charset=utf-8' } },
  )
}

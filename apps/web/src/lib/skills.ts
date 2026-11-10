// src/lib/skills.ts — pure, fixture-tested helpers for the skills
// collection. CI proves correctness here (no browser, no rendering).

export interface SkillListItem {
  id: string
  data: {
    name: string
    description: string
    summary: string
    title: string
    published: Date
    updated?: Date
    order: number
    draft: boolean
  }
}

/** Drop drafts from a skill list. The input array is never mutated. */
export function withoutDrafts<T extends { data: { draft: boolean } }>(skills: T[]): T[] {
  return skills.filter((s) => !skillIsDraft(s))
}

function skillIsDraft(s: { data: { draft: boolean } }): boolean {
  return s.data.draft === true
}

/** Shelf order, ascending `order`. The input array is never mutated. */
export function sortByOrderAsc<T extends { data: { order: number } }>(skills: T[]): T[] {
  return [...skills].sort((a, b) => a.data.order - b.data.order)
}

/**
 * Render an ISO date as e.g. "Nov 9, 2026". The collection schema coerces
 * date-only strings to UTC midnight, so formatting is pinned to UTC — a
 * server in a negative-offset timezone must never shift the day.
 */
export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

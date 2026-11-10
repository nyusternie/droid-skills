// src/lib/skills.test.js — fixtures prove the skills helpers (CI gate).
import { describe, it, expect } from 'vitest'
import { withoutDrafts, sortByOrderAsc, formatDate } from './skills.ts'

const fixture = (id, order, draft = false) => ({
  id,
  data: {
    name: id,
    description: 'fixture description',
    summary: 'fixture summary',
    title: `Skill ${id}`,
    published: new Date('2026-11-09'),
    order,
    draft,
  },
})

describe('withoutDrafts', () => {
  it('drops drafts, keeps published skills, never mutates the input', () => {
    const input = [fixture('a', 1), fixture('b', 2, true)]
    const out = withoutDrafts(input)
    expect(out.map((s) => s.id)).toEqual(['a'])
    expect(input).toHaveLength(2)
  })

  it('returns an empty list when everything is a draft', () => {
    expect(withoutDrafts([fixture('a', 1, true)])).toEqual([])
  })
})

describe('sortByOrderAsc', () => {
  it('orders by ascending shelf order, never mutates the input', () => {
    const input = [fixture('third', 3), fixture('first', 1), fixture('second', 2)]
    const out = sortByOrderAsc(input)
    expect(out.map((s) => s.id)).toEqual(['first', 'second', 'third'])
    expect(input[0].id).toBe('third')
  })
})

describe('formatDate', () => {
  it('renders ISO dates as human dates in UTC (no day shift)', () => {
    expect(formatDate(new Date('2026-11-09'))).toBe('Nov 9, 2026')
    expect(formatDate(new Date('2026-01-01'))).toBe('Jan 1, 2026')
  })
})

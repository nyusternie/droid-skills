// src/lib/skill-markdown.test.js — fixtures prove the SKILL.md assembly
// (CI gate). The served files are agent-consumed: a broken YAML parse is
// a broken product.
import { describe, it, expect } from 'vitest'
import { buildSkillMarkdown, yamlDoubleQuoted } from './skill-markdown.ts'

describe('buildSkillMarkdown', () => {
  it('assembles convention frontmatter + body with a single trailing newline', () => {
    const out = buildSkillMarkdown({
      name: 'adb',
      description: 'Use when a task involves ADB.',
      body: '# ADB\n\nDrive the bridge.',
    })
    expect(out).toBe(
      '---\n' +
        'name: "adb"\n' +
        'description: "Use when a task involves ADB."\n' +
        'license: CC0-1.0\n' +
        '---\n\n' +
        '# ADB\n\nDrive the bridge.\n',
    )
  })

  it('keeps colon-space sequences inside the quoted trigger (YAML-safe)', () => {
    const out = buildSkillMarkdown({
      name: 'logcat',
      description: 'Use when reading logs: capture, filter, triage.',
      body: 'body',
    })
    expect(out).toContain('description: "Use when reading logs: capture, filter, triage."')
  })

  it('always emits the site-wide CC0-1.0 license (spec optional field)', () => {
    const out = buildSkillMarkdown({ name: 'x', description: 'long enough', body: 'body' })
    expect(out).toContain('license: CC0-1.0')
  })

  it('normalizes trailing body whitespace to exactly one newline', () => {
    const out = buildSkillMarkdown({ name: 'x', description: 'long enough', body: 'body\n\n\n' })
    expect(out.endsWith('body\n')).toBe(true)
  })
})

describe('yamlDoubleQuoted', () => {
  it('escapes backslashes and double quotes', () => {
    expect(yamlDoubleQuoted('say "hi" \\ now')).toBe('"say \\"hi\\" \\\\ now"')
  })
})

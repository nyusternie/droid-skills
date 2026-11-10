// apps/web/astro.config.mjs — droidskills.dev (cloned from the
// agenticdroidlife sibling repo's proven config 2026-11-09).
import { defineConfig } from 'astro/config'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// Every external link opens in a new tab (pattern ported from
// rootmyandroid's astro.config.mjs). Content is authored without target
// attributes; this hook rewrites the emitted static HTML after
// `astro build`: any <a> whose href is http(s) and NOT on our own two
// domains gets target="_blank", with rel="noopener" merged in (or added).
// Same-host absolute links, and links that already carry a target, stay
// untouched. Owner ruling 2026-11-09: this site carries NO external
// links at all — the hook stays as a guard so any future external link
// still opens in a new tab like any other outbound link.
// One domain only — no second email domain is in play for this site.
const OWN_HOSTS = ['droidskills.dev']
function externalLinksNewTab() {
  return {
    name: 'external-links-new-tab',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const stack = [fileURLToPath(dir)]
        while (stack.length) {
          const d = stack.pop()
          for (const e of await readdir(d, { withFileTypes: true })) {
            const p = `${d}/${e.name}`
            if (e.isDirectory()) {
              stack.push(p)
              continue
            }
            if (!e.name.endsWith('.html')) continue
            const html = await readFile(p, 'utf8')
            let changed = false
            const out = html.replace(/<a\b[^>]*>/g, (tag) => {
              if (/\btarget\s*=/.test(tag)) return tag
              const m = tag.match(/\bhref\s*=\s*"([^"]*)"/)
              if (!m || !/^https?:\/\//.test(m[1])) return tag
              try {
                const host = new URL(m[1]).hostname
                if (OWN_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return tag
              } catch {
                return tag
              }
              changed = true
              let t = tag
              const r = t.match(/\brel\s*=\s*"([^"]*)"/)
              if (r) {
                const parts = r[1].split(/\s+/).filter(Boolean)
                if (!parts.includes('noopener')) parts.push('noopener')
                t = t.replace(r[0], `rel="${parts.join(' ')}"`)
              } else {
                t = t.replace(/>$/, ' rel="noopener">')
              }
              return t.replace(/>$/, ' target="_blank">')
            })
            if (changed) await writeFile(p, out)
          }
        }
      },
    },
  }
}

// Purely static blog. No SSR, no adapters — `astro build` emits plain
// HTML/CSS to dist/, deployed to Cloudflare Pages. This site ships ZERO
// client JavaScript everywhere (see AGENTS.md rule 4).
export default defineConfig({
  site: 'https://droidskills.dev',
  output: 'static',
  // Auto-generated sitemap-index.xml (+ per-page sitemaps) at build time.
  integrations: [sitemap(), externalLinksNewTab()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // /about -> /about/index.html etc. (clean URLs, Pages-friendly)
    format: 'directory',
  },
})

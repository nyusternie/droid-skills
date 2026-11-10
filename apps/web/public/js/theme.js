// public/js/theme.js — the light / dark / system theme toggle (owner
// ruling 2026-11-10: three states, DEFAULTING TO SYSTEM). One of two
// enhancement scripts on the site (the other is copy.js) — hand-written
// vanilla progressive enhancement shipped as a static asset (AGENTS.md
// rule 4): the toggle renders `hidden` in Base.astro; this script
// reveals it, applies the saved choice, and persists clicks to
// localStorage. With JavaScript disabled the toggle simply never appears
// and the page follows the OS via prefers-color-scheme — the "system"
// state — which is fully usable. JavaScript never gates content.
//
// State model (mirrors the two gated dark blocks in global.css):
//   system → NO data-theme attribute on <html> → the media query decides
//   light  → data-theme="light" → the light @theme values (the
//            :not([data-theme]) gate keeps a dark OS from re-darkening)
//   dark   → data-theme="dark"  → the dark token swaps
(() => {
  const KEY = 'droidskills:theme'
  const STATES = ['system', 'light', 'dark']
  const root = document.documentElement
  const toggle = document.getElementById('theme-toggle')
  if (!toggle) return

  // Reads the saved state; "system" on anything unexpected, and also when
  // storage is unavailable (private mode) — the toggle still works, it
  // just does not persist.
  const read = () => {
    try {
      const saved = localStorage.getItem(KEY)
      return STATES.includes(saved) ? saved : 'system'
    } catch {
      return 'system'
    }
  }

  const apply = (state) => {
    if (state === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state)
    toggle.textContent = `theme: ${state}`
    toggle.setAttribute('aria-pressed', state === 'system' ? 'false' : 'true')
  }

  // Applies the saved choice before first paint where possible (the
  // script is deferred, so this runs at DOM-ready time).
  apply(read())

  toggle.hidden = false
  toggle.addEventListener('click', () => {
    const next = STATES[(STATES.indexOf(read()) + 1) % STATES.length]
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable — apply the state for this page view only */
    }
    apply(next)
  })
})()

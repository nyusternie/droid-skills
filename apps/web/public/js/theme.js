// public/js/theme.js — the light / dark / system theme PICKER (owner
// ruling 2026-11-11: the header button shows the CURRENT theme as an
// icon; clicking it opens a menu of three choices — Light, Dark,
// System — and picking one swaps the button icon. Supersedes the
// 2026-11-10 cycle-on-click selector). DEFAULT IS SYSTEM when nothing
// is saved. One of two enhancement scripts on the site (the other is
// copy.js) — hand-written vanilla progressive enhancement shipped as a
// static asset (AGENTS.md rule 4): the toggle renders `hidden` in
// Base.astro; this script reveals it, applies the saved choice, and
// persists picks to localStorage. With JavaScript disabled the picker
// simply never appears and the page follows the OS via
// prefers-color-scheme — the "system" state — which is fully usable.
// JavaScript never gates content.
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
  const menu = document.getElementById('theme-menu')
  if (!toggle || !menu) return

  // Reads the saved state; "system" on anything unexpected, and also when
  // storage is unavailable (private mode) — the picker still works, it
  // just does not persist.
  const read = () => {
    try {
      const saved = localStorage.getItem(KEY)
      return STATES.includes(saved) ? saved : 'system'
    } catch {
      return 'system'
    }
  }

  // The button icon carries the state without words; the full phrase
  // goes to aria-label so screen readers lose nothing.
  const LABELS = {
    system: 'Theme: system. Activate to open the theme picker.',
    light: 'Theme: light. Activate to open the theme picker.',
    dark: 'Theme: dark. Activate to open the theme picker.',
  }

  // Applies a state everywhere it is visible: the <html> attribute, the
  // button's visible icon, and the menu options' aria-checked (the CSS
  // turns aria-checked="true" into accent text + a visible checkmark).
  const apply = (state) => {
    if (state === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state)
    for (const icon of toggle.querySelectorAll('[data-theme-icon]')) {
      icon.hidden = icon.dataset.themeIcon !== state
    }
    toggle.setAttribute('aria-label', LABELS[state])
    for (const option of menu.querySelectorAll('[data-theme-value]')) {
      option.setAttribute('aria-checked', option.dataset.themeValue === state ? 'true' : 'false')
    }
  }

  const openMenu = () => {
    menu.hidden = false
    toggle.setAttribute('aria-expanded', 'true')
  }
  const closeMenu = () => {
    menu.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
  }

  const choose = (state) => {
    try {
      localStorage.setItem(KEY, state)
    } catch {
      /* storage unavailable — apply the state for this page view only */
    }
    apply(state)
    closeMenu()
  }

  // Applies the saved choice before first paint where possible (the
  // script is deferred, so this runs at DOM-ready time).
  apply(read())

  toggle.hidden = false
  toggle.addEventListener('click', (event) => {
    // Stop the document-level outside-click closer from immediately
    // re-closing the menu this click just opened.
    event.stopPropagation()
    if (menu.hidden) openMenu()
    else closeMenu()
  })
  for (const option of menu.querySelectorAll('[data-theme-value]')) {
    option.addEventListener('click', () => choose(option.dataset.themeValue))
  }

  // Outside click or Escape closes the menu (focus returns to the
  // toggle so keyboard users are not stranded).
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !menu.contains(event.target)) closeMenu()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu()
      toggle.focus()
    }
  })
})()

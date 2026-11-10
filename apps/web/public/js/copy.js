// apps/web/public/js/copy.js — the ONLY client-side script on the site
// (AGENTS.md rule 4, owner ruling 2026-11-10: JavaScript as progressive
// enhancement ONLY). Static asset, loaded with `defer` from Base.astro.
//
// What it does: every CopyBlock (src/components/CopyBlock.astro) renders a
// Copy button with the `hidden` attribute. This script reveals the button
// and wires it to the Clipboard API; if the script never runs (JavaScript
// off, blocked, or an old browser), the button stays hidden and the block
// still works — one click on the command selects it whole (user-select:
// all), ready for Ctrl/Cmd+C. JavaScript never gates the content.
//
// What it never does: no tracking, no network, no storage, no DOM beyond
// the copy blocks.
(function () {
  'use strict'

  var RESET_AFTER_MS = 1800

  document.querySelectorAll('.copyblock').forEach(function (block) {
    var code = block.querySelector('.copyblock-code')
    var btn = block.querySelector('.copyblock-btn')
    var hint = block.querySelector('.copyblock-hint')
    if (!code || !btn) return

    // The enhancement is live: show the button, retire the no-JS hint.
    btn.hidden = false
    if (hint) hint.hidden = true

    btn.addEventListener('click', function () {
      var command = code.textContent || ''

      function resetSoon() {
        window.setTimeout(function () {
          btn.textContent = 'Copy'
          btn.classList.remove('copyblock-btn-copied')
        }, RESET_AFTER_MS)
      }

      function selectInstead() {
        // Clipboard write failed (permission denied, non-secure context):
        // fall back to selecting the command so Ctrl/Cmd+C is one step.
        var range = document.createRange()
        range.selectNodeContents(code)
        var selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
        btn.textContent = 'Selected'
        resetSoon()
      }

      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        selectInstead()
        return
      }

      navigator.clipboard.writeText(command).then(
        function () {
          btn.textContent = 'Copied!'
          btn.classList.add('copyblock-btn-copied')
          resetSoon()
        },
        function () {
          selectInstead()
        }
      )
    })
  })
})()

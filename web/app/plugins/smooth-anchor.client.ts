// Smooth-scroll for every in-page anchor link site-wide.
//
// A single delegated listener catches any click that bubbles up from an
// `<a href="#id">`, wherever it lives — hero CTAs, the main menu, and the
// raw anchors that RichTextRenderer emits via v-html (which can't carry their
// own Vue handlers). This is why same-page anchors are rendered as plain
// `<a href="#…">` rather than `<NuxtLink :to>`: a router link resolves the
// href to a full path (so it wouldn't match `#…`) and vue-router's own click
// handler would scroll instantly before this one ever runs.
export default defineNuxtPlugin(() => {
  document.addEventListener('click', (e) => {
    // Leave modified/non-primary clicks and new-tab links to the browser.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!link || link.target === '_blank') return

    const id = link.getAttribute('href')?.slice(1)
    const el = id ? document.getElementById(id) : null
    if (!el) return

    e.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    // Reflect the anchor in the URL while preserving Vue Router's history state.
    history.replaceState(history.state, '', `#${id}`)
  })
})

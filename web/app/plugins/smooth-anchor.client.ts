// Smooth-scroll for every in-page anchor link site-wide.
//
// A single delegated listener catches any click from an in-page anchor,
// wherever it lives — hero CTAs, the main menu (desktop `<a href="#id">` and
// the mobile slideover's full-path `<a href="/slug#id">`), and the raw anchors
// that RichTextRenderer emits via v-html (which can't carry their own Vue
// handlers).
//
// IMPORTANT — this runs in the CAPTURE phase, not bubble.
// Even plain `<a href="#id">` menu links trigger a vue-router navigation (a
// same-page hash change). vue-router's own click handler runs on a bubble-phase
// listener attached to the link/header subtree, so a bubble-phase listener here
// on `document` would run *after* it — by which point vue-router has already
// `preventDefault()`-ed and navigated. Worse, vue-router's scroll is silently
// suppressed for these same-page navigations (it never scrolls even when
// `scrollBehavior` returns a valid position), so the page just sits at the top
// and only the *second* click — when the route is already at the hash — falls
// through to this handler and scrolls. Running in capture lets us handle the
// click first and `stopImmediatePropagation()` so vue-router never gets it,
// making this the single, reliable owner of same-page anchor scrolling.
export default defineNuxtPlugin(() => {
  const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

  document.addEventListener('click', (e) => {
    // Leave modified/non-primary clicks and new-tab links to the browser.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
    if (!link || link.target === '_blank') return

    const href = link.getAttribute('href')
    if (!href) return

    // Resolve a target id only when the link points at a fragment on the page
    // we're already on: either a bare `#id`, or `/<current-path>#id` (the form
    // the mobile menu renders). Cross-page links (`/other#id`) and external
    // links fall through untouched so vue-router / the browser handle them.
    let id: string | null = null
    if (href.startsWith('#')) {
      id = href.slice(1)
    } else {
      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (
        url.origin === window.location.origin &&
        normalizePath(url.pathname) === normalizePath(window.location.pathname) &&
        url.hash
      ) {
        id = url.hash.slice(1)
      }
    }
    if (!id) return

    const el = document.getElementById(id)
    if (!el) return

    // Own the scroll: stop the event before vue-router's click handler can run
    // a (scroll-less) navigation, then smooth-scroll ourselves.
    e.preventDefault()
    e.stopImmediatePropagation()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    // Reflect the anchor in the URL while preserving Vue Router's history state.
    history.replaceState(history.state, '', `#${id}`)

    // Same-page anchors don't change the route, so Nuxt UI's "close menu on
    // navigation" never fires. Signal the header to collapse the mobile menu
    // (which otherwise stays full-screen and hides the scroll that just happened).
    document.dispatchEvent(new CustomEvent('smooth-anchor:navigate'))
  }, true)
})

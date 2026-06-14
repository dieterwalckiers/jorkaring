<script setup lang="ts">
/**
 * E-book lead-capture popup (Item 8) — Mailchimp + instant download.
 *
 * Behaviour:
 *  - Installs a single delegated `document` click listener. ANY anchor on the
 *    site whose href is `#ebook` (case-insensitive, also matches a trailing
 *    `…#ebook`) opens our own modal instead of navigating. This is the
 *    site-wide convention — set a CMS button/link's URL to `#ebook` (inline
 *    button block, hero CTA, splitTextImage button, toast, sticky message, …)
 *    and it will trigger this popup, no per-component wiring needed.
 *  - The modal shows a small lead form (Voornaam + E-mailadres). On submit we
 *    subscribe the lead to Mailchimp entirely client-side (JSONP — no API key,
 *    no server) using the configured `ebook.mailchimpActionUrl`, then trigger
 *    an instant in-browser download of the configured PDF.
 *  - The value exchange (their email for the PDF) is honoured on any terminal
 *    result: success, "already subscribed", or even a network hiccup — we never
 *    withhold the PDF once they've submitted.
 *
 * Config comes from SiteSettings → ebook (enabled / mailchimpActionUrl / pdf /
 * buttonCaption). When `enabled` is false, the listener does nothing and lets
 * the click fall through to normal behaviour. When `mailchimpActionUrl` is
 * empty, the subscribe step is skipped (dev-only warning) and the PDF still
 * downloads.
 */
import type { Media } from '~/types/media'
import type { SiteSettings } from '~/types/siteSettings'

// The component only renders a teleported modal (no inline root element), so
// any fallthrough attrs (e.g. a `style` injected by a parent wrapper) have
// nowhere to land — opt out of attribute inheritance to avoid a Vue warning.
defineOptions({ inheritAttrs: false })

const { data: siteSettings } = useSiteSettings()

// Resolve the PDF media URL at setup time (resolver is pure → safe in callbacks).
const resolveMediaUrl = useMediaUrlResolver()

const ebook = computed(() => (siteSettings.value as SiteSettings | null)?.ebook)

const pdfUrl = computed(() => {
  const pdf = ebook.value?.pdf
  if (!pdf || typeof pdf !== 'object') return undefined
  return resolveMediaUrl((pdf as Media).url)
})

const buttonCaption = computed(() => ebook.value?.buttonCaption?.trim() || 'Download e-book')

// --- UI state ---------------------------------------------------------------
const open = ref(false)
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const fname = ref('')
const email = ref('')

function resetForm() {
  status.value = 'idle'
  errorMessage.value = ''
  fname.value = ''
  email.value = ''
}

function openModal() {
  if (!ebook.value?.enabled) return
  resetForm()
  open.value = true
}

function closeModal() {
  open.value = false
}

// --- Mailchimp (client-side JSONP) ------------------------------------------
/** Honeypot field name follows Mailchimp's pattern: b_{u}_{id}. */
const honeypotFieldName = computed(() => {
  const action = ebook.value?.mailchimpActionUrl
  if (!action) return ''
  try {
    const url = new URL(action)
    const u = url.searchParams.get('u')
    const id = url.searchParams.get('id')
    if (u && id) return `b_${u}_${id}`
  }
  catch {
    // fall through
  }
  return ''
})

let jsonpCounter = 0

function jsonp(url: string): Promise<{ result: string, msg: string }> {
  return new Promise((resolve, reject) => {
    const callbackName = `mc_cb_${Date.now()}_${++jsonpCounter}`
    const script = document.createElement('script')
    let settled = false

    const cleanup = () => {
      delete (window as Record<string, unknown>)[callbackName]
      script.remove()
    }

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true
        cleanup()
        reject(new Error('Request timed out'))
      }
    }, 10000)

    ;(window as Record<string, unknown>)[callbackName] = (data: { result: string, msg: string }) => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        cleanup()
        resolve(data)
      }
    }

    script.src = `${url}&c=${callbackName}`
    script.onerror = () => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        cleanup()
        reject(new Error('Network error'))
      }
    }

    document.body.appendChild(script)
  })
}

async function subscribe(): Promise<void> {
  const action = ebook.value?.mailchimpActionUrl?.trim()
  if (!action) {
    if (import.meta.dev) {
      console.warn('[EbookPopup] No Mailchimp action URL configured — skipping lead capture, delivering download only.')
    }
    return
  }

  const jsonpUrl = action.replace('/subscribe/post?', '/subscribe/post-json?')

  const params = new URLSearchParams({
    EMAIL: email.value,
    FNAME: fname.value,
  })
  if (honeypotFieldName.value) {
    params.set(honeypotFieldName.value, '')
  }

  const data = await jsonp(`${jsonpUrl}&${params.toString()}`)

  // Mailchimp returns result:'error' with a msg containing "already" when the
  // address is already on the list — that's a terminal success for our purposes.
  const alreadySubscribed
    = data.result === 'error' && /already/i.test(data.msg || '')

  if (data.result !== 'success' && !alreadySubscribed) {
    const clean = data.msg?.replace(/<[^>]*>/g, '') || 'Inschrijven is niet gelukt. Probeer het opnieuw.'
    throw new Error(clean)
  }
}

// --- Download ---------------------------------------------------------------
const DOWNLOAD_FILENAME = 'In-10-dagen-naar-minder-hinder-in-je-rug.pdf'

// The PDF is served from the Payload origin (cross-origin), and the `download`
// attribute is ignored for cross-origin URLs — the browser would just open the
// file in a new tab. Fetching it as a blob gives us a same-origin object URL,
// so `download` is honoured and the browser actually saves the file. CORS is
// allowed for the site origin in payload.config.ts. If the fetch is ever
// blocked, fall back to opening the file directly.
async function downloadPdf() {
  const url = pdfUrl.value
  if (!url) return
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) throw new Error(`Download failed (${res.status})`)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = DOWNLOAD_FILENAME
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  }
  catch {
    // Last resort if the blob fetch is blocked (e.g. CORS misconfig): open it.
    window.open(url, '_blank', 'noopener')
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function submitForm() {
  if (status.value === 'loading') return
  if (!fname.value.trim()) {
    status.value = 'error'
    errorMessage.value = 'Vul je voornaam in.'
    return
  }
  if (!EMAIL_RE.test(email.value.trim())) {
    status.value = 'error'
    errorMessage.value = 'Vul een geldig e-mailadres in.'
    return
  }

  status.value = 'loading'
  errorMessage.value = ''

  try {
    await subscribe()
  }
  catch (err) {
    // Lead capture failed (network/timeout/Mailchimp). The visitor still gets
    // the e-book — don't punish them for our integration hiccup; just log it.
    console.warn('[EbookPopup] lead capture failed:', err)
  }
  // Either way, land on the thank-you state. The download is now an explicit
  // click there, never automatic — calmer than a surprise save dialog.
  status.value = 'success'
}

// --- #ebook click delegation ------------------------------------------------
function onDocumentClick(e: MouseEvent) {
  // Leave modified / non-primary clicks to the browser.
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

  const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href]')
  if (!link) return

  const href = link.getAttribute('href')?.trim().toLowerCase()
  // Match exactly "#ebook" or any URL ending in "#ebook".
  if (href !== '#ebook' && !href?.endsWith('#ebook')) return

  if (!ebook.value?.enabled) return

  e.preventDefault()
  openModal()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) closeModal()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ebook-fade-enter"
      leave-active-class="ebook-fade-leave"
    >
      <div
        v-if="open"
        class="ebook-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-modal-title"
        @click.self="closeModal"
      >
        <div class="ebook-modal">
          <button
            type="button"
            class="ebook-close"
            aria-label="Sluiten"
            @click="closeModal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <!-- Success state -->
          <div v-if="status === 'success'" class="ebook-body ebook-body--success">
            <span class="ebook-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <p class="ebook-eyebrow">Bedankt!</p>
            <h2 id="ebook-modal-title" class="ebook-title">Je e-book staat klaar</h2>
            <p class="ebook-intro">
              Fijn dat je erbij bent. Klik hieronder om <em>In 10 dagen naar minder hinder in je rug</em>
              te downloaden — en zet vandaag nog je eerste stap.
            </p>
            <button type="button" class="ebook-submit btn-outline-inline" @click="downloadPdf">
              Download je e-book
            </button>
            <p class="ebook-fineprint">
              Af en toe stuur ik je praktische tips voor een sterke, pijnvrije rug. Uitschrijven kan altijd.
            </p>
          </div>

          <!-- Form state (idle / loading / error) -->
          <div v-else class="ebook-body">
            <p class="ebook-eyebrow">Gratis e-book</p>
            <h2 id="ebook-modal-title" class="ebook-title">In 10 dagen naar minder hinder in je rug</h2>
            <p class="ebook-intro">
              Laat je naam en e-mailadres achter, dan kun je het e-book meteen downloaden.
            </p>

            <form class="ebook-form" @submit.prevent="submitForm">
              <label class="ebook-field">
                <span class="ebook-label">Voornaam</span>
                <input
                  v-model="fname"
                  type="text"
                  name="FNAME"
                  autocomplete="given-name"
                  class="ebook-input"
                  required
                >
              </label>

              <label class="ebook-field">
                <span class="ebook-label">E-mailadres</span>
                <input
                  v-model="email"
                  type="email"
                  name="EMAIL"
                  autocomplete="email"
                  class="ebook-input"
                  required
                >
              </label>

              <!-- Honeypot — must stay visually hidden -->
              <div v-if="honeypotFieldName" aria-hidden="true" class="ebook-honeypot">
                <input type="text" :name="honeypotFieldName" tabindex="-1" value="">
              </div>

              <p v-if="status === 'error'" class="ebook-error">
                {{ errorMessage }}
              </p>

              <button
                type="submit"
                class="ebook-submit btn-outline-inline"
                :disabled="status === 'loading'"
              >
                <template v-if="status === 'loading'">Bezig…</template>
                <template v-else>{{ buttonCaption }}</template>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ebook-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: rgba(25, 78, 85, 0.5);
  backdrop-filter: blur(2px);
}

/*
 * The modal surface is the warm off-white. Text/inputs use fixed brand-palette
 * inks that read correctly on that surface — we deliberately do NOT lean on the
 * page-level theme vars (--color-font / --color-main-bg), because the CMS theme
 * sets those for a moss-green page background (off-white text, dark surfaces),
 * which would be invisible / inverted on this light card. Palette is the
 * client-locked one (moss #194E55, woody #8F6C53, off-white #EDE3D9).
 */
.ebook-modal {
  --ebook-surface: var(--color-theme3, #ede3d9);
  --ebook-ink: #194e55; /* moss green */
  --ebook-woody: #8f6c53; /* woody accent */
  position: relative;
  width: 100%;
  max-width: 30rem;
  background-color: var(--ebook-surface);
  color: var(--ebook-ink);
  border-radius: 2px;
  box-shadow: 0 24px 60px -20px rgba(25, 78, 85, 0.45);
}

.ebook-body {
  padding: 2.75rem 2.25rem 2.5rem;
}

.ebook-close {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: var(--ebook-ink);
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 200ms cubic-bezier(0.33, 1, 0.68, 1);
}

.ebook-close:hover {
  opacity: 1;
}

.ebook-eyebrow {
  margin: 0 0 0.625rem;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ebook-woody);
}

.ebook-title {
  margin: 0;
  font-family: var(--font-h1, 'Playfair Display', serif);
  font-weight: 700;
  font-size: 1.65rem;
  line-height: 1.2;
  color: var(--ebook-ink);
}

.ebook-intro {
  margin: 0.875rem 0 0;
  font-size: 0.975rem;
  line-height: 1.55;
  color: color-mix(in srgb, var(--ebook-ink) 82%, transparent);
  max-width: 34ch;
}

.ebook-form {
  margin-top: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.ebook-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ebook-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: color-mix(in srgb, var(--ebook-ink) 78%, transparent);
}

.ebook-input {
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  color: var(--ebook-ink);
  background-color: #fffdfa;
  border: 1px solid color-mix(in srgb, var(--ebook-ink) 22%, transparent);
  border-radius: 2px;
  transition: border-color 180ms cubic-bezier(0.33, 1, 0.68, 1);
}

.ebook-input:focus {
  outline: none;
  border-color: var(--ebook-ink);
}

.ebook-honeypot {
  position: absolute;
  left: -5000px;
}

.ebook-error {
  margin: -0.25rem 0 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #a23b30;
}

.ebook-submit {
  margin-top: 0.25rem;
  align-self: flex-start;
  cursor: pointer;
}

.ebook-submit:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.ebook-link {
  color: var(--ebook-ink);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ebook-link:hover {
  text-decoration: none;
}

/* --- Thank-you (success) state --- */
.ebook-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 1.1rem;
  border-radius: 9999px;
  color: var(--ebook-surface);
  background-color: var(--ebook-ink);
}

.ebook-check svg {
  width: 1.35rem;
  height: 1.35rem;
}

.ebook-intro em {
  font-style: italic;
  color: var(--ebook-ink);
}

.ebook-body--success .ebook-submit {
  margin-top: 1.6rem;
  align-self: auto;
}

.ebook-fineprint {
  margin: 1.4rem 0 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: color-mix(in srgb, var(--ebook-ink) 58%, transparent);
  max-width: 38ch;
}

/* Considered, restrained entrance — matches the site's ease-out-cubic. */
.ebook-fade-enter {
  animation: ebook-in 280ms cubic-bezier(0.33, 1, 0.68, 1);
}

.ebook-fade-leave {
  animation: ebook-in 180ms cubic-bezier(0.33, 1, 0.68, 1) reverse;
}

@keyframes ebook-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ebook-fade-enter,
  .ebook-fade-leave {
    animation: none;
  }
}
</style>

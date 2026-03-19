<script setup lang="ts">
import type { NewsletterSignupBlock } from '~/types/blocks'

const props = defineProps<{
  block: NewsletterSignupBlock
}>()

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

const email = ref('')
const fname = ref('')
const lname = ref('')

/**
 * Derive the Mailchimp honeypot field name from the action URL.
 * The honeypot name follows the pattern: b_{u}_{id}
 */
const honeypotFieldName = computed(() => {
  try {
    const url = new URL(props.block.mailchimpActionUrl)
    const u = url.searchParams.get('u')
    const id = url.searchParams.get('id')
    if (u && id) {
      return `b_${u}_${id}`
    }
  }
  catch {
    // fall through
  }
  return ''
})

let jsonpCounter = 0

function jsonp(url: string): Promise<{ result: string; msg: string }> {
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

    ;(window as Record<string, unknown>)[callbackName] = (data: { result: string; msg: string }) => {
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

async function submitForm() {
  if (status.value === 'loading') return
  status.value = 'loading'
  errorMessage.value = ''

  try {
    const jsonpUrl = props.block.mailchimpActionUrl.replace(
      '/subscribe/post?',
      '/subscribe/post-json?',
    )

    const params = new URLSearchParams({
      EMAIL: email.value,
      FNAME: fname.value,
      LNAME: lname.value,
    })

    if (honeypotFieldName.value) {
      params.set(honeypotFieldName.value, '')
    }

    const url = `${jsonpUrl}&${params.toString()}`
    const data = await jsonp(url)

    if (data.result === 'success') {
      status.value = 'success'
    }
    else {
      status.value = 'error'
      // Mailchimp returns HTML in msg — strip tags for plain text display
      errorMessage.value = data.msg?.replace(/<[^>]*>/g, '') || 'Subscription failed. Please try again.'
    }
  }
  catch {
    status.value = 'error'
    errorMessage.value = 'A network error occurred. Please try again.'
  }
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-12 text-center">
    <h2 v-if="block.heading" class="text-2xl font-bold md:text-3xl">
      {{ block.heading }}
    </h2>
    <p v-if="block.description" class="mt-3 text-lg text-[var(--color-font)]/70">
      {{ block.description }}
    </p>

    <div v-if="status === 'success'" class="mt-8">
      <p class="text-lg font-medium">
        {{ block.successMessage || 'Thank you for subscribing!' }}
      </p>
    </div>

    <form
      v-else
      class="mt-8 flex flex-col items-center gap-4"
      @submit.prevent="submitForm"
    >
      <input
        v-model="fname"
        type="text"
        name="FNAME"
        placeholder="First name"
        class="newsletter-input w-full sm:w-auto sm:min-w-80"
      />
      <input
        v-model="lname"
        type="text"
        name="LNAME"
        placeholder="Last name"
        class="newsletter-input w-full sm:w-auto sm:min-w-80"
      />
      <input
        v-model="email"
        type="email"
        name="EMAIL"
        required
        :placeholder="block.emailPlaceholder || 'Your email address'"
        class="newsletter-input w-full sm:w-auto sm:min-w-80"
      />

      <!-- Honeypot field for bot protection — must stay hidden -->
      <div v-if="honeypotFieldName" aria-hidden="true" class="absolute -left-[5000px]">
        <input type="text" :name="honeypotFieldName" tabindex="-1" value="" />
      </div>

      <p v-if="status === 'error'" class="text-sm text-[var(--color-error-font,_#dc2626)]">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="status === 'loading'"
        class="btn-outline-inline cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        <template v-if="status === 'loading'">
          Sending...
        </template>
        <template v-else>
          {{ block.buttonLabel || 'Subscribe' }}
        </template>
      </button>
    </form>
  </section>
</template>

<style scoped>
.newsletter-input {
  padding: 0.625rem 1.5rem;
  border: 2px solid var(--color-5);
  border-radius: 9999px;
  font-size: 1rem;
  color: var(--color-font);
  background-color: transparent;
  transition: border-color 150ms;
}

.newsletter-input::placeholder {
  color: var(--color-font);
  opacity: 0.4;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--color-button-font);
}
</style>

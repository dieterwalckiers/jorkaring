export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      neutral: 'slate',
    },
    button: {
      slots: {
        // No global min-width: it deforms Nuxt UI's internal icon buttons
        // (e.g. the UHeader mobile toggle, which would otherwise be a 180px-wide
        // button with the icon centered, leaving it un-aligned from the right
        // edge). The CTA buttons set their own min-width in ButtonOutline.vue.
        base: 'rounded-[var(--radius-button)] justify-center font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors',
      },
    },
    slideover: {
      slots: {
        content: 'bg-white',
      },
    },
  },
})

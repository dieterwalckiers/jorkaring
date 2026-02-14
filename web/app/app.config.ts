export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'rounded-[var(--radius-button)] font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors',
      },
    },
    slideover: {
      slots: {
        content: 'bg-white',
      },
    },
  },
})

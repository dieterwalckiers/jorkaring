export default defineNuxtPlugin(() => {
  // Force light mode regardless of system preference
  const colorMode = useColorMode()
  colorMode.preference = 'light'
})

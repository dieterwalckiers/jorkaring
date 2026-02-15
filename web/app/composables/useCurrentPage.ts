import type { Page } from '~/types/page'

export function useCurrentPage() {
  const currentPage = useState<Page | null>('currentPage', () => null)

  function setCurrentPage(page: Page | null) {
    currentPage.value = page
  }

  return { currentPage: readonly(currentPage), setCurrentPage }
}

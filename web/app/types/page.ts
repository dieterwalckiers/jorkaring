import type { ContentBlock } from './blocks'

export interface PageRef {
  id: string
  title: string
  slug: string
}

export interface PageSeo {
  description?: string
}

export interface Page {
  id: string
  title: string
  slug: string
  showInMenu: boolean
  menuOrder?: number
  showInToolbar?: boolean
  toolbarLabel?: string
  toolbarOrder?: number
  menuFilter?: PageRef[]
  content?: ContentBlock[]
  seo?: PageSeo
  createdAt: string
  updatedAt: string
}

export interface PagesResponse {
  docs: Page[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

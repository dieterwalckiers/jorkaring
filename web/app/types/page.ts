import type { ContentBlock } from './blocks'

export interface PageRef {
  id: string
  title: string
  slug: string
  menuLabel?: string
  menuItemStyle?: string
}

// One link in a page's "Menu items" override. `page` is the populated target
// (or just its id if unpopulated); `label` overrides the link text for this placement.
export interface MenuItemOverride {
  id?: string
  page: PageRef | string | number
  label?: string
  // Optional anchor (Anchor block id) on the target page to jump to.
  anchor?: string
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
  menuLabel?: string
  menuItemStyle?: string
  showInToolbar?: boolean
  toolbarLabel?: string
  toolbarOrder?: number
  overrideMainMenu?: boolean
  menuItems?: MenuItemOverride[]
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

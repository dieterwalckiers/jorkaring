'use client'
import { useEffect, useState } from 'react'
import { useRowLabel } from '@payloadcms/ui'

type RelationValue = number | string | { id: number | string; title?: string } | null | undefined

interface MenuItemRow {
  label?: string | null
  page?: RelationValue
  anchor?: string | null
}

const titleOf = (page: RelationValue): string | undefined =>
  page && typeof page === 'object' ? page.title : undefined

const idOf = (page: RelationValue): number | string | undefined =>
  page && typeof page === 'object' ? page.id : (page ?? undefined)

// Row label for the per-page "Menu items" override array. Shows the custom
// label when set, otherwise the linked page's title (fetched on demand since
// the relationship is stored as an id in the form), falling back to a number.
export const MenuItemRowLabel = () => {
  const { data, rowNumber } = useRowLabel<MenuItemRow>()
  const custom = typeof data?.label === 'string' ? data.label.trim() : ''
  const pageId = idOf(data?.page)
  const [title, setTitle] = useState<string | undefined>(titleOf(data?.page))

  useEffect(() => {
    if (custom) return
    const inlineTitle = titleOf(data?.page)
    if (inlineTitle) {
      setTitle(inlineTitle)
      return
    }
    if (pageId === undefined || pageId === null || pageId === '') {
      setTitle(undefined)
      return
    }
    let cancelled = false
    fetch(`/api/pages/${pageId}?depth=0`)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (!cancelled && doc?.title) setTitle(doc.title)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [pageId, custom, data?.page])

  const fallback = `Menu item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const anchor = typeof data?.anchor === 'string' ? data.anchor.trim() : ''
  return (
    <span>
      {custom || title || fallback}
      {anchor ? ` #${anchor}` : ''}
    </span>
  )
}

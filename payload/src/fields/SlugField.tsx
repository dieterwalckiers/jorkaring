'use client'
import { useEffect, useRef } from 'react'
import { useField, useFormFields, FieldLabel, TextInput } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and dashes)
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
}

export const SlugField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })
  const prevTitleRef = useRef<string>('')

  // Watch the title field
  const titleValue = useFormFields(([fields]) => {
    const titleField = fields['title']
    return titleField?.value as string | undefined
  })

  useEffect(() => {
    if (titleValue !== undefined && titleValue !== prevTitleRef.current) {
      const newSlug = slugify(titleValue)
      setValue(newSlug)
      prevTitleRef.current = titleValue
    }
  }, [titleValue, setValue])

  return (
    <div className="field-type text">
      <FieldLabel label={field.label} required={field.required} path={path} />
      <TextInput
        path={path}
        value={value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
    </div>
  )
}

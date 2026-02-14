'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

// Size values mapping to max-width in pixels (matching frontend RichTextRenderer)
const SIZE_STYLES: Record<string, string> = {
  'tiny-icon': '38px',
  'small-icon': '58px',
  icon: '77px',
  'large-icon': '120px',
  tiny: '240px',
  small: '360px',
  medium: '600px',
  large: '840px',
  xlarge: '1080px',
  huge: '1440px',
  full: '100%',
  original: 'none',
}

// Plugin component that applies styles to upload nodes
function StyledUploadPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // Function to apply styles to upload elements
    const applyUploadStyles = () => {
      const rootElement = editor.getRootElement()
      if (!rootElement) return

      // Find all upload/decorator elements
      const uploadElements = rootElement.querySelectorAll('[data-lexical-decorator="true"]')

      uploadElements.forEach((element) => {
        // Try to get the node key from the element
        const nodeKey = element.getAttribute('data-lexical-decorator')
        if (!nodeKey) return

        // Read the editor state to find the upload node data
        editor.getEditorState().read(() => {
          try {
            // Get all nodes and find upload nodes
            const editorState = editor.getEditorState()
            const json = editorState.toJSON()

            // Traverse the JSON to find upload nodes
            const findUploadNodes = (node: Record<string, unknown>): Array<Record<string, unknown>> => {
              const results: Array<Record<string, unknown>> = []
              if (node.type === 'upload') {
                results.push(node)
              }
              if (Array.isArray(node.children)) {
                for (const child of node.children) {
                  results.push(...findUploadNodes(child as Record<string, unknown>))
                }
              }
              return results
            }

            const uploadNodes = findUploadNodes(json.root as Record<string, unknown>)

            // For each upload node, try to match it to the DOM element
            uploadNodes.forEach((uploadNode) => {
              const fields = uploadNode.fields as Record<string, unknown> | undefined
              if (!fields) return

              const size = (fields.size as string) || 'medium'
              const alignment = (fields.alignment as string) || 'center'

              // Find the image within this upload element
              const img = element.querySelector('img')
              if (!img) return

              // Apply size styling
              const maxWidth = SIZE_STYLES[size] || SIZE_STYLES.medium
              if (maxWidth !== 'none') {
                img.style.maxWidth = maxWidth
              } else {
                img.style.maxWidth = ''
              }
              img.style.height = 'auto'

              // Apply alignment to the wrapper
              const wrapper = element as HTMLElement
              wrapper.style.display = 'flex'
              wrapper.style.width = '100%'

              switch (alignment) {
                case 'left':
                  wrapper.style.justifyContent = 'flex-start'
                  break
                case 'right':
                  wrapper.style.justifyContent = 'flex-end'
                  break
                case 'center':
                default:
                  wrapper.style.justifyContent = 'center'
                  break
              }
            })
          } catch {
            // Silently handle any errors during state reading
          }
        })
      })
    }

    // Apply styles initially and on editor updates
    const removeUpdateListener = editor.registerUpdateListener(() => {
      // Use setTimeout to ensure DOM has been updated
      setTimeout(applyUploadStyles, 50)
    })

    // Initial application
    setTimeout(applyUploadStyles, 100)

    return () => {
      removeUpdateListener()
    }
  }, [editor])

  return null
}

export const StyledUploadFeatureClient = createClientFeature({
  plugins: [
    {
      Component: StyledUploadPlugin,
      position: 'normal',
    },
  ],
})

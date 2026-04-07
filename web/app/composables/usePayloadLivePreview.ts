import { useLivePreview } from '@payloadcms/live-preview-vue'

/**
 * Wraps @payloadcms/live-preview-vue for use in this project.
 * When rendered inside the Payload admin iframe, data updates in real time
 * via postMessage. Otherwise, it passes through the initial data unchanged.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches the upstream library's constraint
export function usePayloadLivePreview<T extends Record<string, any>>(initialData: T) {
  const config = useRuntimeConfig()
  const serverURL = config.public.payloadServerUrl as string

  return useLivePreview<T>({
    initialData,
    serverURL,
    depth: 2,
  })
}

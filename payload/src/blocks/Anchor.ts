import type { Block } from 'payload'

export const Anchor: Block = {
  slug: 'anchor',
  labels: {
    singular: 'Anchor',
    plural: 'Anchors',
  },
  fields: [
    {
      // `id` is reserved by Payload for the row primary key, so the field is
      // stored as `anchorId` but shown to editors simply as "ID".
      name: 'anchorId',
      label: 'ID',
      type: 'text',
      required: true,
      admin: {
        description:
          'The id for this spot on the page. Link to it from elsewhere with #<id> — e.g. set "about" here, then link to "https://mysite.com/#about". Use lowercase letters, numbers and hyphens; no spaces.',
      },
    },
  ],
}

import type { Block } from 'payload'

export const NewsletterSignup: Block = {
  slug: 'newsletterSignup',
  labels: {
    singular: 'Newsletter Signup',
    plural: 'Newsletter Signups',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Heading text, e.g. "Subscribe to our newsletter"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional supporting text below the heading',
      },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Subscribe',
      admin: {
        description: 'Text for the submit button',
      },
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      admin: {
        description: 'Placeholder text for the email input, e.g. "Your email address"',
      },
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thank you for subscribing!',
      admin: {
        description: 'Message shown after successful subscription',
      },
    },
    {
      name: 'mailchimpActionUrl',
      type: 'text',
      required: true,
      admin: {
        description:
          'Mailchimp form action URL (from embed code), e.g. "https://yourlist.us1.list-manage.com/subscribe/post?u=...&id=..."',
      },
    },
  ],
}

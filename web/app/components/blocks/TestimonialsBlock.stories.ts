import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import type { TestimonialsBlock } from '~/types/blocks'

import TestimonialsBlockComponent from './TestimonialsBlock.vue'

const meta = {
  title: 'Blocks/Testimonials',
  component: TestimonialsBlockComponent,
  tags: ['autodocs'],
  argTypes: {
    block: {
      control: 'object',
      description: 'The testimonials block data object',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TestimonialsBlockComponent>

export default meta
type Story = StoryObj<typeof meta>

const baseBlock: TestimonialsBlock = {
  id: '1',
  blockType: 'testimonials',
  testimonials: [
    {
      id: 'testimonial-1',
      quote: 'Working with this team has transformed our business. Their expertise and dedication are unmatched.',
      name: 'Jane Smith (Acme Corp)',
    },
    {
      id: 'testimonial-2',
      quote: 'The results exceeded our expectations. We saw a 40% increase in engagement within the first month.',
      name: 'Michael Chen (Digital Ventures)',
    },
    {
      id: 'testimonial-3',
      quote: 'Professional, responsive, and truly committed to delivering quality. Highly recommended!',
      name: 'Sarah Johnson (Tech Solutions)',
    },
  ],
}

export const Default: Story = {
  args: {
    block: baseBlock,
  },
}

export const SingleTestimonial: Story = {
  args: {
    block: {
      id: '2',
      blockType: 'testimonials',
      testimonials: [
        {
          id: 'testimonial-1',
          quote: 'This is a standalone testimonial without navigation buttons since there is only one.',
          name: 'John Doe',
        },
      ],
    },
  },
}

export const LongQuote: Story = {
  args: {
    block: {
      id: '4',
      blockType: 'testimonials',
      testimonials: [
        {
          id: 'testimonial-1',
          quote: 'This is an exceptionally long testimonial that spans multiple lines to test how the component handles longer content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          name: 'Alexander Maximilian (International Business Group)',
        },
      ],
    },
  },
}

export const ManyTestimonials: Story = {
  args: {
    block: {
      id: '5',
      blockType: 'testimonials',
      testimonials: [
        { id: 't-1', quote: 'First testimonial in a series of five.', name: 'Person One (Company A)' },
        { id: 't-2', quote: 'Second testimonial with different content.', name: 'Person Two (Company B)' },
        { id: 't-3', quote: 'Third testimonial showcasing variety.', name: 'Person Three (Company C)' },
        { id: 't-4', quote: 'Fourth testimonial in the rotation.', name: 'Person Four (Company D)' },
        { id: 't-5', quote: 'Fifth and final testimonial in this collection.', name: 'Person Five (Company E)' },
      ],
    },
  },
}

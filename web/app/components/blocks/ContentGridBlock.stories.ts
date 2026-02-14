import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import type { ContentGridBlock } from '~/types/blocks'

import ContentGridBlockComponent from './ContentGridBlock.vue'

// Helper to create rich text with heading and paragraph
function createRichTextWithHeading(heading: string, paragraph: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          tag: 'h3',
          children: [{ type: 'text', text: heading }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: paragraph }],
        },
      ],
    },
  }
}

const meta = {
  title: 'Blocks/ContentGrid',
  component: ContentGridBlockComponent,
  tags: ['autodocs'],
  argTypes: {
    block: {
      control: 'object',
      description: 'The content grid block data object',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ContentGridBlockComponent>

export default meta
type Story = StoryObj<typeof meta>

const baseBlock: ContentGridBlock = {
  id: '1',
  blockType: 'contentGrid',
  cells: [
    { id: 'cell-1', content: createRichTextWithHeading('Feature 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.') },
    { id: 'cell-2', content: createRichTextWithHeading('Feature 2', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.') },
    { id: 'cell-3', content: createRichTextWithHeading('Feature 3', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.') },
  ],
  numberOfColumns: '3',
  cellAlignment: 'left',
}

export const Default: Story = {
  args: {
    block: baseBlock,
  },
}

export const TwoColumns: Story = {
  args: {
    block: {
      id: '3',
      blockType: 'contentGrid',
      cells: [
        { id: 'cell-1', content: createRichTextWithHeading('Left Column', 'Content for the left side of a two-column layout.') },
        { id: 'cell-2', content: createRichTextWithHeading('Right Column', 'Content for the right side of a two-column layout.') },
      ],
      numberOfColumns: '2',
      cellAlignment: 'left',
    },
  },
}

export const FourColumns: Story = {
  args: {
    block: {
      id: '4',
      blockType: 'contentGrid',
      cells: [
        { id: 'cell-1', content: createRichTextWithHeading('Q1', 'First quarter results exceeded expectations.') },
        { id: 'cell-2', content: createRichTextWithHeading('Q2', 'Second quarter showed steady growth.') },
        { id: 'cell-3', content: createRichTextWithHeading('Q3', 'Third quarter maintained momentum.') },
        { id: 'cell-4', content: createRichTextWithHeading('Q4', 'Fourth quarter closed strong.') },
      ],
      numberOfColumns: '4',
      cellAlignment: 'left',
    },
  },
}

export const FiveColumns: Story = {
  args: {
    block: {
      id: '5',
      blockType: 'contentGrid',
      cells: [
        { id: 'cell-1', content: createRichTextWithHeading('Mon', 'Team standup at 9am') },
        { id: 'cell-2', content: createRichTextWithHeading('Tue', 'Design review') },
        { id: 'cell-3', content: createRichTextWithHeading('Wed', 'Sprint planning') },
        { id: 'cell-4', content: createRichTextWithHeading('Thu', 'Development') },
        { id: 'cell-5', content: createRichTextWithHeading('Fri', 'Demo & retro') },
      ],
      numberOfColumns: '5',
      cellAlignment: 'left',
    },
  },
}

export const CenterAligned: Story = {
  args: {
    block: {
      id: '6',
      blockType: 'contentGrid',
      cells: [
        { id: 'cell-1', content: createRichTextWithHeading('Service 1', 'Consulting and strategy') },
        { id: 'cell-2', content: createRichTextWithHeading('Service 2', 'Design and development') },
        { id: 'cell-3', content: createRichTextWithHeading('Service 3', 'Support and maintenance') },
      ],
      numberOfColumns: '3',
      cellAlignment: 'center',
    },
  },
}

export const RightAligned: Story = {
  args: {
    block: {
      id: '7',
      blockType: 'contentGrid',
      cells: [
        { id: 'cell-1', content: createRichTextWithHeading('Price A', '$99/month') },
        { id: 'cell-2', content: createRichTextWithHeading('Price B', '$199/month') },
        { id: 'cell-3', content: createRichTextWithHeading('Price C', '$299/month') },
      ],
      numberOfColumns: '3',
      cellAlignment: 'right',
    },
  },
}

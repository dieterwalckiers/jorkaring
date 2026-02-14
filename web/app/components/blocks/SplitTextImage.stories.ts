import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import type { SplitTextImageBlock } from '~/types/blocks'

import SplitTextImage from './SplitTextImage.vue'

const meta = {
  title: 'Blocks/SplitTextImage',
  component: SplitTextImage,
  tags: ['autodocs'],
  argTypes: {
    block: {
      control: 'object',
      description: 'The split text + image block data object',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SplitTextImage>

export default meta
type Story = StoryObj<typeof meta>

// Mock rich text content in Lexical format
const mockRichText = {
  root: {
    children: [
      {
        children: [
          { text: 'Transform Your Business', type: 'text' },
        ],
        type: 'heading',
        tag: 'h2',
      },
      {
        children: [
          {
            text: 'We help organizations unlock their full potential through innovative solutions and strategic guidance. Our approach combines deep expertise with a commitment to lasting results.',
            type: 'text',
          },
        ],
        type: 'paragraph',
      },
    ],
    type: 'root',
  },
}

const mockImage = {
  id: 'img-1',
  url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  alt: 'Modern office space',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const baseBlock: SplitTextImageBlock = {
  id: '1',
  blockType: 'splitTextImage',
  text: mockRichText,
  image: mockImage,
  buttons: [
    { id: 'btn-1', caption: 'Learn More', link: '/about' },
    { id: 'btn-2', caption: 'Contact Us', link: '/contact' },
  ],
}

export const Default: Story = {
  args: {
    block: baseBlock,
  },
}

export const ImageOnLeft: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '2',
      imagePosition: 'left',
    },
  },
}

export const ImageOnRight: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '3',
      imagePosition: 'right',
    },
  },
}

export const NarrowImage: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '4',
      imagePercentage: 30,
    },
  },
}

export const WideImage: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '5',
      imagePercentage: 60,
    },
  },
}

export const PortraitRatio: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '7',
      imageRatio: '2/3',
    },
  },
}

export const SquareRatio: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '9',
      imageRatio: '1/1',
    },
  },
}

export const WithBackground: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '18',
      backgroundColor: '#f8f9fa',
    },
  },
}

export const WithoutButtons: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '24',
      buttons: [],
    },
  },
}

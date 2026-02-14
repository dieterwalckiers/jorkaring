import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import type { TableBlock as TableBlockType } from '~/types/blocks'

import TableBlock from './TableBlock.vue'

const meta = {
  title: 'Blocks/TableBlock',
  component: TableBlock,
  tags: ['autodocs'],
  argTypes: {
    block: {
      control: 'object',
      description: 'The table block data object',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TableBlock>

export default meta
type Story = StoryObj<typeof meta>

const baseCsvData = `color,temperature,mood
red,warm,energetic
blue,cold,calm
green,neutral,balanced`

const baseBlock: TableBlockType = {
  id: '1',
  blockType: 'table',
  csvData: baseCsvData,
}

export const Default: Story = {
  args: {
    block: baseBlock,
  },
}

export const WithTitleRow: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '2',
      firstRowAreTitles: true,
    },
  },
}

export const WithBorders: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '3',
      showBorders: true,
    },
  },
}

export const WithTitleRowAndBorders: Story = {
  args: {
    block: {
      ...baseBlock,
      id: '4',
      firstRowAreTitles: true,
      showBorders: true,
    },
  },
}

export const WithButtonRow: Story = {
  args: {
    block: {
      id: '5',
      blockType: 'table',
      csvData: `Feature,Basic,Pro
Storage,5 GB,100 GB
Users,1,Unlimited
Learn more,Learn more,Learn more`,
      firstRowAreTitles: true,
      lastRowAreButtons: true,
      buttonLinksCsv: '/features,/basic,/pro',
    },
  },
}

export const FullFeatured: Story = {
  args: {
    block: {
      id: '6',
      blockType: 'table',
      csvData: `Talent,Welzijn,Organisatie,Communicatie
Loopbaan,Stress- en burn out,Psychologische veiligheid,Conflict
Leiderschap,Re-integratie,Missie en visie,Verbindende communicatie
Emotionele intelligentie,Emotie- en stressregulatie,Merkbelofte en merkverhaal,Feedback
Lees meer,Lees meer,Lees meer,Lees meer`,
      firstRowAreTitles: true,
      lastRowAreButtons: true,
      buttonLinksCsv: '/talent,/welzijn,/organisatie,/communicatie',
    },
  },
}

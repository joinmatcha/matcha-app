import type { Meta, StoryObj } from '@storybook/react';

import PersonalityProfileHeader from './PersonalityProfileHeader';

const meta: Meta<typeof PersonalityProfileHeader> = {
  title: 'Components/Personality/PersonalityProfileHeader',
  component: PersonalityProfileHeader,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'app' },
  },
};

export default meta;
type Story = StoryObj<typeof PersonalityProfileHeader>;

export const WithLogo: Story = {
  args: {
    label: 'Le Stratège',
    type: 'INTJ',
    showLogo: true,
  },
};

export const WithoutLogo: Story = {
  args: {
    label: 'Le Visionnaire',
    type: 'ENFP',
    showLogo: false,
  },
};

export const WithoutType: Story = {
  args: {
    label: 'Ton archétype professionnel',
    showLogo: false,
  },
};

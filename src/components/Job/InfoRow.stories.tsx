import type { Meta, StoryObj } from '@storybook/react';

import InfoRow from './InfoRow';

const meta: Meta<typeof InfoRow> = {
  title: 'Components/Job/InfoRow',
  component: InfoRow,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfoRow>;

export const Default: Story = {
  args: {
    label: 'Accompagnement des personnes en difficulté',
  },
};

export const ShortLabel: Story = {
  args: {
    label: 'Travail en équipe',
  },
};

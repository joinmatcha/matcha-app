import type { Meta, StoryObj } from '@storybook/react';

import RadarChart from './RadarChart';

const data = [
  { label: 'Créativité', value: 0.8 },
  { label: 'Initiative', value: 0.6 },
  { label: 'Rigueur', value: 0.7 },
  { label: 'Esprit pratique', value: 0.5 },
  { label: 'Autonomie', value: 0.9 },
  { label: 'Collaboration', value: 0.4 },
];

const meta: Meta<typeof RadarChart> = {
  title: 'Components/Personality/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  args: { data },
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 200 },
};

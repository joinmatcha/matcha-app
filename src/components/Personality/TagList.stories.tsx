import type { Meta, StoryObj } from '@storybook/react';

import TagList from './TagList';

const meta: Meta<typeof TagList> = {
  title: 'Components/Personality/TagList',
  component: TagList,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'app' },
  },
  args: {
    items: ['Leadership', 'Communication', 'Adaptabilité', "Esprit d'équipe"],
  },
};

export default meta;
type Story = StoryObj<typeof TagList>;

export const Success: Story = {
  args: { variant: 'success' },
};

export const Warning: Story = {
  args: { variant: 'warning' },
};

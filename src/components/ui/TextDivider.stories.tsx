import type { Meta, StoryObj } from '@storybook/react';

import TextDivider from './TextDivider';

const meta: Meta<typeof TextDivider> = {
  title: 'Components/Divider/TextDivider',
  component: TextDivider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextDivider>;

export const Default: Story = {
  args: {
    text: 'ou',
  },
};

export const LongText: Story = {
  args: {
    text: 'continuer avec',
  },
};

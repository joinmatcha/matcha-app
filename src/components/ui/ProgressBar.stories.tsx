import type { Meta, StoryObj } from '@storybook/react';

import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Empty: Story = {
  args: { value: 0 },
};

export const Half: Story = {
  args: { value: 50 },
};

export const Complete: Story = {
  args: { value: 100 },
};

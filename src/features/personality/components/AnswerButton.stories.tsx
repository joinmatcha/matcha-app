import type { Meta, StoryObj } from '@storybook/react';

import AnswerButton from './AnswerButton';

const meta: Meta<typeof AnswerButton> = {
  title: 'Components/Personality/AnswerButton',
  component: AnswerButton,
  tags: ['autodocs'],
  args: {
    value: 1,
    index: 0,
    totalOptions: 4,
    isSelected: false,
    onPress: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof AnswerButton>;

export const Unselected: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const LastOption: Story = {
  args: { index: 3, totalOptions: 4 },
};

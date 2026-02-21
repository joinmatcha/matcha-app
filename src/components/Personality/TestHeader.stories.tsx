import type { Meta, StoryObj } from '@storybook/react';

import TestHeader from './TestHeader';

const meta: Meta<typeof TestHeader> = {
  title: 'Components/Personality/TestHeader',
  component: TestHeader,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'app' },
  },
  args: {
    title: 'Test de personnalité',
    totalQuestions: 20,
  },
};

export default meta;
type Story = StoryObj<typeof TestHeader>;

export const Start: Story = {
  args: { currentQuestion: 1 },
};

export const MidWay: Story = {
  args: { currentQuestion: 10 },
};

export const WithSummary: Story = {
  args: {
    currentQuestion: 5,
    summary: 'Évalue tes préférences naturelles.',
  },
};

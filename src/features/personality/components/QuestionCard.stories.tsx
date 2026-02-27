import type { Meta, StoryObj } from '@storybook/react';

import QuestionCard from './QuestionCard';

const options = [
  { value: -2, label: 'Pas du tout' },
  { value: -1, label: 'Plutôt non' },
  { value: 1, label: 'Plutôt oui' },
  { value: 2, label: 'Tout à fait' },
];

const meta: Meta<typeof QuestionCard> = {
  title: 'Components/Personality/QuestionCard',
  component: QuestionCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'app' },
  },
  args: {
    questionNumber: 1,
    questionText: "Tu préfères travailler seul plutôt qu'en équipe.",
    options,
    onAnswer: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof QuestionCard>;

export const Unanswered: Story = {};

export const Answered: Story = {
  args: { selectedValue: 1 },
};

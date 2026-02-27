import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';

import ProfileSection from './ProfileSection';

const meta: Meta<typeof ProfileSection> = {
  title: 'Components/Personality/ProfileSection',
  component: ProfileSection,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'app' },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileSection>;

export const Default: Story = {
  args: {
    title: 'Tes forces dominantes',
    children: <Text>Contenu de la section</Text>,
  },
};

export const Last: Story = {
  args: {
    title: 'Prochaines étapes',
    isLast: true,
    children: <Text>Dernière section de la page</Text>,
  },
};

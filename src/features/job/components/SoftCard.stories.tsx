import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';

import SoftCard from './SoftCard';

const meta: Meta<typeof SoftCard> = {
  title: 'Components/Job/SoftCard',
  component: SoftCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'app' },
  },
};

export default meta;
type Story = StoryObj<typeof SoftCard>;

export const Default: Story = {
  args: {
    children: <Text>Contenu de la carte</Text>,
  },
};

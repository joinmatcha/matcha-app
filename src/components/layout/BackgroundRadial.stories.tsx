import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';

import BackgroundRadial from './BackgroundRadial';

const meta: Meta<typeof BackgroundRadial> = {
  title: 'Components/Layout/BackgroundRadial',
  component: BackgroundRadial,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackgroundRadial>;

export const WithoutBubbles: Story = {
  args: {
    children: <Text style={{ color: 'white', padding: 20 }}>Contenu</Text>,
    bubbles: false,
  },
};

export const WithBubbles: Story = {
  args: {
    children: <Text style={{ color: 'white', padding: 20 }}>Contenu</Text>,
    bubbles: true,
  },
};

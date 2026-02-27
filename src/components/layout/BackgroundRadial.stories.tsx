import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, Text } from 'react-native';

import BackgroundRadial from './BackgroundRadial';

const meta: Meta<typeof BackgroundRadial> = {
  title: 'Components/Layout/BackgroundRadial',
  component: BackgroundRadial,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackgroundRadial>;

const styles = StyleSheet.create({
  text: {
    color: 'white',
    padding: 20,
  },
});

export const WithoutBubbles: Story = {
  args: {
    children: <Text style={styles.text}>Contenu</Text>,
    bubbles: false,
  },
};

export const WithBubbles: Story = {
  args: {
    children: <Text style={styles.text}>Contenu</Text>,
    bubbles: true,
  },
};

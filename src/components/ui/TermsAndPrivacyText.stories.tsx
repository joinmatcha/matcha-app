import type { Meta, StoryObj } from '@storybook/react';

import TermsAndPrivacyText from './TermsAndPrivacyText';

const meta: Meta<typeof TermsAndPrivacyText> = {
  title: 'Components/UI/TermsAndPrivacyText',
  component: TermsAndPrivacyText,
  tags: ['autodocs'],
  args: {
    showModalTerms: () => {},
    showModalPrivacy: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof TermsAndPrivacyText>;

export const Default: Story = {};

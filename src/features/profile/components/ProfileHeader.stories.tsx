import type { Meta, StoryObj } from '@storybook/react';

import { UserFull } from '@/types/user';

import ProfileHeader from './ProfileHeader';

const mockUser: UserFull = {
  id: '1',
  firstName: 'Sophie',
  lastName: 'Martin',
  email: 'sophie.martin@example.com',
  subscription: 'free',
  isEmailVerified: true,
  consentAccepted: true,
};

const meta: Meta<typeof ProfileHeader> = {
  title: 'Components/Profile/ProfileHeader',
  component: ProfileHeader,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'app' },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const WithoutAvatar: Story = {
  args: { user: mockUser },
};

export const WithAvatar: Story = {
  args: {
    user: {
      ...mockUser,
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
    },
  },
};

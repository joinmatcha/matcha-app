import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import SwipePreferencesCard from '@/features/home/components/SwipePreferencesCard';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

describe('SwipePreferencesCard', () => {
  const onSwipePress = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("affiche l'état vide quand totalLikes est 0", () => {
    const prefs = {
      totalLikes: 0,
      totalDislikes: 0,
      topSectors: [],
      topCompetences: [],
      topTags: [],
      topWorkConditions: [],
      recentLikes: [],
    };
    const { getByText } = render(
      <SwipePreferencesCard preferences={prefs} onSwipePress={onSwipePress} />,
    );
    expect(getByText('Commencer à swiper')).toBeTruthy();
  });

  it('affiche le compteur quand il y a des likes', () => {
    const prefs = {
      totalLikes: 5,
      totalDislikes: 2,
      topSectors: [{ key: 'Tech', score: 3 }],
      topCompetences: [],
      topTags: [],
      topWorkConditions: [],
      recentLikes: [],
    };
    const { getByText } = render(
      <SwipePreferencesCard preferences={prefs} onSwipePress={onSwipePress} />,
    );
    expect(getByText('5 métiers aimés')).toBeTruthy();
    expect(getByText('Tech')).toBeTruthy();
  });

  it('appelle onSwipePress quand on clique', () => {
    const prefs = {
      totalLikes: 1,
      totalDislikes: 0,
      topSectors: [],
      topCompetences: [],
      topTags: [],
      topWorkConditions: [],
      recentLikes: [],
    };
    const { getByText } = render(
      <SwipePreferencesCard preferences={prefs} onSwipePress={onSwipePress} />,
    );
    fireEvent.press(getByText('Continuer à swiper'));
    expect(onSwipePress).toHaveBeenCalledTimes(1);
  });
});

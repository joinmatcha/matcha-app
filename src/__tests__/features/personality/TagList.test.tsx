import { render } from '@testing-library/react-native';
import React from 'react';

import TagList from '@/features/personality/components/TagList';

jest.mock('react-native-paper', () => {
  const { Text } = require('react-native');
  return { Text, DefaultTheme: { colors: {}, fonts: {} } };
});

describe('TagList', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<TagList items={['Tag1', 'Tag2']} />)).not.toThrow();
  });

  it('affiche tous les items', () => {
    const { getByText } = render(<TagList items={['Force', 'Créativité']} />);
    expect(getByText('Force')).toBeTruthy();
    expect(getByText('Créativité')).toBeTruthy();
  });

  it('se rend avec le variant warning', () => {
    expect(() =>
      render(<TagList items={['Faiblesse']} variant="warning" />),
    ).not.toThrow();
  });

  it('se rend avec une liste vide', () => {
    expect(() => render(<TagList items={[]} />)).not.toThrow();
  });
});

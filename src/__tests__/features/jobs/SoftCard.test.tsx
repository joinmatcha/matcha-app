import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import SoftCard from '@/features/jobs/components/SoftCard';

describe('SoftCard', () => {
  it('se rend sans erreur avec des enfants', () => {
    const { getByText } = render(
      <SoftCard>
        <Text>Contenu</Text>
      </SoftCard>,
    );
    expect(getByText('Contenu')).toBeTruthy();
  });
});

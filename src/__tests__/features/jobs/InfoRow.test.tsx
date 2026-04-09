import { render } from '@testing-library/react-native';
import React from 'react';

import InfoRow from '@/features/jobs/components/InfoRow';

describe('InfoRow', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<InfoRow label="Développeur" />)).not.toThrow();
  });

  it('affiche le label', () => {
    const { getByText } = render(<InfoRow label="Développeur web" />);
    expect(getByText('Développeur web')).toBeTruthy();
  });
});

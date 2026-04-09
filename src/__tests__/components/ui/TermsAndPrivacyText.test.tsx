import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import TermsAndPrivacyText from '@/components/ui/TermsAndPrivacyText';

jest.mock('react-native-paper', () => {
  const { Text } = require('react-native');
  return { Text, DefaultTheme: { colors: {}, fonts: {} } };
});

describe('TermsAndPrivacyText', () => {
  const showModalTerms = jest.fn();
  const showModalPrivacy = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur', () => {
    expect(() =>
      render(
        <TermsAndPrivacyText
          showModalTerms={showModalTerms}
          showModalPrivacy={showModalPrivacy}
        />,
      ),
    ).not.toThrow();
  });

  it('appelle showModalTerms quand on clique sur conditions générales', () => {
    const { getByText } = render(
      <TermsAndPrivacyText
        showModalTerms={showModalTerms}
        showModalPrivacy={showModalPrivacy}
      />,
    );
    fireEvent.press(getByText('conditions générales'));
    expect(showModalTerms).toHaveBeenCalledTimes(1);
  });

  it('appelle showModalPrivacy quand on clique sur politique de confidentialité', () => {
    const { getByText } = render(
      <TermsAndPrivacyText
        showModalTerms={showModalTerms}
        showModalPrivacy={showModalPrivacy}
      />,
    );
    fireEvent.press(getByText('politique de confidentialité'));
    expect(showModalPrivacy).toHaveBeenCalledTimes(1);
  });
});

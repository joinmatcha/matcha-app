import { render } from '@testing-library/react-native';

import { toastConfig } from '@/config/toastConfig';

jest.mock('react-native-paper', () => ({
  DefaultTheme: { colors: {}, fonts: {} },
}));

describe('toastConfig', () => {
  it('success rend le titre', () => {
    const Toast = toastConfig.success({ text1: 'Bravo' });
    const { getByText } = render(Toast);
    expect(getByText('Bravo')).toBeTruthy();
  });

  it('success rend le sous-titre quand il est fourni', () => {
    const Toast = toastConfig.success({ text1: 'Ok', text2: 'Détails' });
    const { getByText } = render(Toast);
    expect(getByText('Détails')).toBeTruthy();
  });

  it('error rend le titre', () => {
    const Toast = toastConfig.error({ text1: 'Erreur' });
    const { getByText } = render(Toast);
    expect(getByText('Erreur')).toBeTruthy();
  });

  it('error rend le sous-titre quand il est fourni', () => {
    const Toast = toastConfig.error({ text1: 'Oops', text2: 'Réessaie' });
    const { getByText } = render(Toast);
    expect(getByText('Réessaie')).toBeTruthy();
  });
});

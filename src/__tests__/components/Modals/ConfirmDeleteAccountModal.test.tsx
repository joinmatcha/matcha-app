import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import ConfirmDeleteAccountModal from '@/components/Modals/ConfirmDeleteAccountModal';

jest.mock('react-native-paper', () => {
  const { Text, Pressable } = require('react-native');
  return {
    Text,
    Button: ({ children, onPress, ...rest }: any) => (
      <Pressable onPress={onPress} {...rest}>
        <Text>{children}</Text>
      </Pressable>
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

describe('ConfirmDeleteAccountModal', () => {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur quand visible', () => {
    expect(() =>
      render(
        <ConfirmDeleteAccountModal
          visible={true}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />,
      ),
    ).not.toThrow();
  });

  it('affiche le titre de suppression', () => {
    const { getByText } = render(
      <ConfirmDeleteAccountModal
        visible={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );
    expect(getByText('Supprimer mon compte')).toBeTruthy();
  });

  it('appelle onConfirm quand on clique sur Supprimer', () => {
    const { getByText } = render(
      <ConfirmDeleteAccountModal
        visible={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.press(getByText('Supprimer'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('appelle onCancel quand on clique sur Annuler', () => {
    const { getByText } = render(
      <ConfirmDeleteAccountModal
        visible={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.press(getByText('Annuler'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

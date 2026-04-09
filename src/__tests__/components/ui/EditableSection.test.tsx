import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import EditableSection from '@/components/ui/EditableSection';

describe('EditableSection', () => {
  const onEdit = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend avec le titre et le contenu', () => {
    const { getByText } = render(
      <EditableSection title="Infos" isEditing={false} onEdit={onEdit}>
        <Text>Contenu</Text>
      </EditableSection>,
    );
    expect(getByText('Infos')).toBeTruthy();
    expect(getByText('Contenu')).toBeTruthy();
  });

  it('affiche le bouton Modifier quand isEditing est false', () => {
    const { getByText } = render(
      <EditableSection title="Infos" isEditing={false} onEdit={onEdit}>
        <Text>Contenu</Text>
      </EditableSection>,
    );
    expect(getByText('Modifier')).toBeTruthy();
  });

  it('masque le bouton Modifier quand isEditing est true', () => {
    const { queryByText } = render(
      <EditableSection title="Infos" isEditing={true} onEdit={onEdit}>
        <Text>Contenu</Text>
      </EditableSection>,
    );
    expect(queryByText('Modifier')).toBeNull();
  });

  it('appelle onEdit quand on clique sur Modifier', () => {
    const { getByText } = render(
      <EditableSection title="Infos" isEditing={false} onEdit={onEdit}>
        <Text>Contenu</Text>
      </EditableSection>,
    );
    fireEvent.press(getByText('Modifier'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});

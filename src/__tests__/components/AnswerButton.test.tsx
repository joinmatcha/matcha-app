import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import AnswerButton from '@/features/personality/components/AnswerButton';

const defaultProps = {
  value: 1,
  index: 0,
  totalOptions: 5,
  isSelected: false,
  onPress: jest.fn(),
};

describe('AnswerButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('se rend sans erreur', () => {
    expect(() => render(<AnswerButton {...defaultProps} />)).not.toThrow();
  });

  it('appelle onPress quand on appuie', () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <AnswerButton {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('se rend sans erreur pour chaque index (0 à 4)', () => {
    for (let index = 0; index < 5; index++) {
      expect(() =>
        render(<AnswerButton {...defaultProps} index={index} />),
      ).not.toThrow();
    }
  });

  it('se rend sans erreur quand isSelected est true', () => {
    expect(() =>
      render(<AnswerButton {...defaultProps} isSelected={true} />),
    ).not.toThrow();
  });
});

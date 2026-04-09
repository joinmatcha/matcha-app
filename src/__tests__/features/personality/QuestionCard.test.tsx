import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import QuestionCard from '@/features/personality/components/QuestionCard';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

const options = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
];

describe('QuestionCard', () => {
  const onAnswer = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend avec le numéro de question et le texte', () => {
    const { getByText } = render(
      <QuestionCard
        questionNumber={1}
        questionText="Je suis créatif"
        options={options}
        onAnswer={onAnswer}
      />,
    );
    expect(getByText('Question 1')).toBeTruthy();
    expect(getByText('Je suis créatif')).toBeTruthy();
  });

  it('appelle onAnswer quand on sélectionne une option', () => {
    const { UNSAFE_getAllByType } = render(
      <QuestionCard
        questionNumber={1}
        questionText="Question"
        options={options}
        onAnswer={onAnswer}
      />,
    );
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(buttons[0]);
    expect(onAnswer).toHaveBeenCalledWith(1);
  });
});

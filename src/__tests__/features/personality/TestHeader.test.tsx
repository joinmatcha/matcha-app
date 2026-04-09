import { render } from '@testing-library/react-native';
import React from 'react';

import TestHeader from '@/features/personality/components/TestHeader';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

describe('TestHeader', () => {
  it('se rend avec le titre et la progression', () => {
    const { getByText } = render(
      <TestHeader title="Test MBTI" currentQuestion={3} totalQuestions={10} />,
    );
    expect(getByText('Test MBTI')).toBeTruthy();
    expect(getByText('3 / 10')).toBeTruthy();
  });

  it('affiche le summary quand il est fourni', () => {
    const { getByText } = render(
      <TestHeader
        title="Test"
        summary="Description"
        currentQuestion={1}
        totalQuestions={5}
      />,
    );
    expect(getByText('Description')).toBeTruthy();
  });
});

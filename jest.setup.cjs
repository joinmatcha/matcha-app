const React = require('react');
const { Text } = require('react-native');

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: ({ name, ...props }) =>
    React.createElement(Text, { ...props }, name),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const React = require('react');
const { Text } = require('react-native');

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: ({ name, ...props }) =>
    React.createElement(Text, { ...props }, name),
}));

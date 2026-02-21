const React = require('react');
const { View } = require('react-native');

const Screen = (props) => React.createElement(View, props);
const ScreenContainer = (props) => React.createElement(View, props);
const ScreenStack = (props) => React.createElement(View, props);

module.exports = {
  Screen,
  ScreenContainer,
  ScreenStack,
  enableScreens: () => {},
};

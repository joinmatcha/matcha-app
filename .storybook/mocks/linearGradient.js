const React = require('react');
const { View } = require('react-native');

const LinearGradient = ({ children, style, ...props }) =>
  React.createElement(View, { style, ...props }, children);

LinearGradient.displayName = 'LinearGradientMock';

module.exports = { LinearGradient };
module.exports.default = LinearGradient;

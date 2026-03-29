const React = require('react');

function SvgMock(props) {
  return React.createElement('svg', { 'data-testid': 'svg-mock', ...props });
}

module.exports = SvgMock;
module.exports.default = SvgMock;

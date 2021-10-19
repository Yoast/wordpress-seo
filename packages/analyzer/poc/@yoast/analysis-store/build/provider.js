"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createProvider = ({
  store
}) => ({
  children
}) => /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
  store: store
}, children);

var _default = createProvider;
exports.default = _default;
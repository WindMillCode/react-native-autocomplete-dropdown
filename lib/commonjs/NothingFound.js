"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NothingFound = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _withFadeAnimation = require("./HOC/withFadeAnimation");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const NothingFound = exports.NothingFound = /*#__PURE__*/(0, _react.memo)(({
  ...props
}) => {
  const EL = (0, _withFadeAnimation.withFadeAnimation)(() => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      ...styles.container
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.text,
      children: props.emptyResultText || 'Nothing found'
    })
  }), {});
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(EL, {});
});
const styles = _reactNative.StyleSheet.create({
  container: {
    padding: 10
  },
  text: {
    textAlign: 'center'
  }
});
//# sourceMappingURL=NothingFound.js.map
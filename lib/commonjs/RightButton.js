"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RightButton = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeFeather = require("react-native-feather");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const RightButton = exports.RightButton = /*#__PURE__*/(0, _react.memo)(({
  inputHeight,
  onClearPress,
  onChevronPress,
  isOpened,
  showChevron,
  showClear,
  loading,
  enableLoadingIndicator,
  buttonsContainerStyle,
  ChevronIconComponent,
  ClearIconComponent,
  RightIconComponent,
  onRightIconComponentPress,
  testID
}) => {
  const isOpenedAnimationValue = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  (0, _react.useEffect)(() => {
    _reactNative.Animated.timing(isOpenedAnimationValue, {
      duration: 350,
      toValue: isOpened ? 1 : 0,
      useNativeDriver: true,
      easing: _reactNative.Easing.bezier(0.3, 0.58, 0.25, 0.99)
    }).start();
  }, [isOpened, isOpenedAnimationValue]);
  const chevronSpin = isOpenedAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: {
      ...styles.container,
      height: inputHeight,
      ...buttonsContainerStyle
    },
    children: [(!enableLoadingIndicator || !loading) && showClear && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
      testID: testID + "_Clear_Button",
      accessibilityLabel: testID + "_Clear_Button",
      accessible: false,
      onPress: onClearPress,
      style: styles.clearButton,
      children: ClearIconComponent ?? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeFeather.XCircle, {
        width: 18,
        stroke: "#aeb4c6"
      })
    }), enableLoadingIndicator && loading && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
      color: "#999"
    }), RightIconComponent && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
      onPress: onRightIconComponentPress,
      style: styles.chevronButton,
      children: RightIconComponent
    }), showChevron && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.View, {
      style: {
        transform: [{
          rotate: chevronSpin
        }]
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
        testID: testID + "_Toggle_Button",
        accessibilityLabel: testID + "_Toggle_Button",
        accessible: false,
        onPress: onChevronPress,
        style: styles.chevronButton,
        children: ChevronIconComponent ?? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeFeather.ChevronDown, {
          width: 20,
          stroke: "#727992"
        })
      })
    })]
  });
});
const styles = _reactNative.StyleSheet.create({
  container: {
    position: 'relative',
    flex: 0,
    flexDirection: 'row',
    right: 8,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  clearButton: {
    width: 26,
    alignItems: 'center'
  },
  chevronButton: {
    width: 26,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  }
});
//# sourceMappingURL=RightButton.js.map
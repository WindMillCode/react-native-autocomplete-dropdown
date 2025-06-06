"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutocompleteDropdownContextProvider = exports.AutocompleteDropdownContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const AutocompleteDropdownContext = exports.AutocompleteDropdownContext = /*#__PURE__*/_react.default.createContext({
  content: undefined,
  setContent: () => null,
  direction: undefined,
  setDirection: () => null,
  activeInputContainerRef: undefined,
  activeControllerRef: undefined,
  controllerRefs: undefined,
  configureAnimation: () => null
});
const AutocompleteDropdownContextProvider = ({
  headerOffset = 0,
  children,
  closeOnTouchEnd = true
}) => {
  const [content, setContent] = (0, _react.useState)();
  const [direction, setDirection] = (0, _react.useState)(undefined);
  const [show, setShow] = (0, _react.useState)(false);
  const [dropdownHeight, setDropdownHeight] = (0, _react.useState)(0);
  const [inputMeasurements, setInputMeasurements] = (0, _react.useState)();
  const [opacity, setOpacity] = (0, _react.useState)(0);
  const [contentStyles, setContentStyles] = (0, _react.useState)(undefined);
  const activeInputContainerRef = (0, _react.useRef)(null);
  const wrapperRef = (0, _react.useRef)(null);
  const activeControllerRef = (0, _react.useRef)(null);
  const controllerRefs = (0, _react.useRef)([]);
  const positionTrackingIntervalRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    if (_reactNative.Platform.OS === 'android' && _reactNative.UIManager.setLayoutAnimationEnabledExperimental) {
      _reactNative.UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  (0, _react.useEffect)(() => {
    if (!inputMeasurements?.height) {
      setOpacity(0);
      return;
    }
    configureAnimation();
    if (dropdownHeight && direction === 'up') {
      setContentStyles({
        bottom: inputMeasurements.bottomY + 5 + headerOffset,
        top: undefined,
        left: inputMeasurements.x,
        width: inputMeasurements.width
      });
      setOpacity(1);
    } else if (direction === 'down') {
      setContentStyles({
        top: inputMeasurements.topY + inputMeasurements.height + 5 + headerOffset,
        bottom: undefined,
        left: inputMeasurements.x,
        width: inputMeasurements.width
      });
      setOpacity(1);
    }
  }, [direction, dropdownHeight, headerOffset, inputMeasurements]);
  const recalculatePosition = (0, _react.useCallback)((showAfterCalculation = false) => {
    activeInputContainerRef?.current?.measure((x, y, width, height, inputPageX, inputPageY) => {
      wrapperRef.current?.measure((wrapperX, wrapperY, wrapperW, wrapperH, wrapperPageX, wrapperPageY) => {
        const currentMeasurement = {
          width,
          height,
          x: inputPageX,
          topY: inputPageY - wrapperPageY,
          bottomY: wrapperH - inputPageY + wrapperPageY
        };
        setInputMeasurements(prev => JSON.stringify(prev) === JSON.stringify(currentMeasurement) ? prev : currentMeasurement);
        showAfterCalculation && setShow(true);
      });
    });
  }, []);
  const configureAnimation = () => {
    _reactNative.LayoutAnimation.configureNext(_reactNative.LayoutAnimation.Presets.easeInEaseOut);
  };
  (0, _react.useEffect)(() => {
    if (content) {
      recalculatePosition(true);
    } else {
      setInputMeasurements(undefined);
      setDropdownHeight(0);
      setOpacity(0);
      setContentStyles(undefined);
      setShow(false);
    }
  }, [content, recalculatePosition]);
  (0, _react.useEffect)(() => {
    if (show && !!opacity) {
      positionTrackingIntervalRef.current = setInterval(() => {
        requestAnimationFrame(() => {
          recalculatePosition();
        });
      }, 16);
    } else {
      clearInterval(positionTrackingIntervalRef.current);
    }
    return () => {
      clearInterval(positionTrackingIntervalRef.current);
    };
  }, [recalculatePosition, opacity, show]);
  const onLayout = (0, _react.useCallback)(e => {
    setDropdownHeight(e.nativeEvent.layout.height);
  }, []);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(AutocompleteDropdownContext.Provider, {
    value: {
      content,
      setContent,
      activeInputContainerRef,
      direction,
      setDirection,
      activeControllerRef,
      controllerRefs,
      configureAnimation
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      ref: wrapperRef,
      style: styles.clickOutsideHandlerArea,
      onTouchEnd: () => {
        if (closeOnTouchEnd) {
          activeControllerRef.current?.close();
          activeControllerRef.current?.blur();
        }
      },
      children: children
    }), !!content && show && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      onLayout: onLayout,
      style: {
        ...styles.wrapper,
        opacity,
        ...contentStyles
      },
      children: content
    })]
  });
};
exports.AutocompleteDropdownContextProvider = AutocompleteDropdownContextProvider;
const styles = _reactNative.StyleSheet.create({
  clickOutsideHandlerArea: {
    flex: 1
  },
  wrapper: {
    position: 'absolute'
  }
});
//# sourceMappingURL=AutocompleteDropdownContext.js.map
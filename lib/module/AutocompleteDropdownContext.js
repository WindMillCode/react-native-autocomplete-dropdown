"use strict";

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AutocompleteDropdownContext = /*#__PURE__*/React.createContext({
  content: undefined,
  setContent: () => null,
  direction: undefined,
  setDirection: () => null,
  activeInputContainerRef: undefined,
  activeControllerRef: undefined,
  controllerRefs: undefined,
  configureAnimation: () => null
});
export const AutocompleteDropdownContextProvider = ({
  headerOffset = 0,
  children,
  closeOnTouchEnd = true
}) => {
  const [content, setContent] = useState();
  const [direction, setDirection] = useState(undefined);
  const [show, setShow] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [inputMeasurements, setInputMeasurements] = useState();
  const [opacity, setOpacity] = useState(0);
  const [contentStyles, setContentStyles] = useState(undefined);
  const activeInputContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const activeControllerRef = useRef(null);
  const controllerRefs = useRef([]);
  const positionTrackingIntervalRef = useRef();
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  useEffect(() => {
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
  const recalculatePosition = useCallback((showAfterCalculation = false) => {
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  useEffect(() => {
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
  useEffect(() => {
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
  const onLayout = useCallback(e => {
    setDropdownHeight(e.nativeEvent.layout.height);
  }, []);
  return /*#__PURE__*/_jsxs(AutocompleteDropdownContext.Provider, {
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
    children: [/*#__PURE__*/_jsx(View, {
      ref: wrapperRef,
      style: styles.clickOutsideHandlerArea,
      onTouchEnd: () => {
        if (closeOnTouchEnd) {
          activeControllerRef.current?.close();
          activeControllerRef.current?.blur();
        }
      },
      children: children
    }), !!content && show && /*#__PURE__*/_jsx(View, {
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
const styles = StyleSheet.create({
  clickOutsideHandlerArea: {
    flex: 1
  },
  wrapper: {
    position: 'absolute'
  }
});
//# sourceMappingURL=AutocompleteDropdownContext.js.map
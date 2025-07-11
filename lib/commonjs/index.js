"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  AutocompleteDropdown: true,
  AutocompleteDropdownContext: true,
  AutocompleteDropdownContextProvider: true
};
exports.AutocompleteDropdown = void 0;
Object.defineProperty(exports, "AutocompleteDropdownContext", {
  enumerable: true,
  get: function () {
    return _AutocompleteDropdownContext.AutocompleteDropdownContext;
  }
});
Object.defineProperty(exports, "AutocompleteDropdownContextProvider", {
  enumerable: true,
  get: function () {
    return _AutocompleteDropdownContext.AutocompleteDropdownContextProvider;
  }
});
var _react = _interopRequireWildcard(require("react"));
var _lodash = _interopRequireDefault(require("lodash.debounce"));
var _reactNative = require("react-native");
var _reactNativeSizeMatters = require("react-native-size-matters");
var _Dropdown = require("./Dropdown");
var _NothingFound = require("./NothingFound");
var _RightButton = require("./RightButton");
var _ScrollViewListItem = require("./ScrollViewListItem");
var _AutocompleteDropdownContext = require("./AutocompleteDropdownContext");
var _diacriticless = _interopRequireDefault(require("./diacriticless"));
var _theme = require("./theme");
var _jsxRuntime = require("react/jsx-runtime");
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const AutocompleteDropdown = exports.AutocompleteDropdown = /*#__PURE__*/(0, _react.memo)(/*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const {
    dataSet: dataSetProp,
    initialValue: initialValueProp,
    clearOnFocus = true,
    caseSensitive = false,
    ignoreAccents = true,
    trimSearchText = true,
    editable = true,
    enableLoadingIndicator = true,
    matchFrom,
    inputHeight = (0, _reactNativeSizeMatters.moderateScale)(40, 0.2),
    suggestionsListMaxHeight = (0, _reactNativeSizeMatters.moderateScale)(200, 0.2),
    // bottomOffset = 0,
    direction: directionProp,
    controller,
    onSelectItem: onSelectItemProp,
    onOpenSuggestionsList: onOpenSuggestionsListProp,
    useFilter,
    renderItem: customRenderItem,
    EmptyResultComponent,
    emptyResultText,
    onClear,
    onChangeText: onTextChange,
    debounce: debounceDelay = 0,
    onChevronPress: onChevronPressProp,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onSubmit: onSubmitProp,
    closeOnSubmit,
    loading: loadingProp,
    LeftComponent,
    textInputProps,
    showChevron,
    showClear,
    rightButtonsContainerStyle,
    ChevronIconComponent,
    ClearIconComponent,
    RightIconComponent,
    onRightIconComponentPress,
    containerStyle,
    inputContainerStyle,
    suggestionsListTextStyle,
    useStateIsOpened,
    testID
  } = props;
  const InputComponent = props.InputComponent || _reactNative.TextInput;
  const inputRef = (0, _react.useRef)(null);
  const containerRef = (0, _react.useRef)(null);
  const [searchText, setSearchText] = (0, _react.useState)('');
  const [inputValue, setInputValue] = (0, _react.useState)('');
  const [loading, setLoading] = (0, _react.useState)(loadingProp);
  const [selectedItem, setSelectedItem] = (0, _react.useState)(null);
  const [isOpened, setIsOpened] = useStateIsOpened ?? (0, _react.useState)(false);
  const initialDataSetRef = (0, _react.useRef)(dataSetProp);
  const initialValueRef = (0, _react.useRef)(initialValueProp);
  const [dataSet, setDataSet] = (0, _react.useState)(dataSetProp);
  const matchFromStart = matchFrom === 'start' ? true : false;
  const {
    content,
    setContent,
    activeInputContainerRef,
    activeControllerRef,
    direction = directionProp,
    setDirection,
    controllerRefs,
    configureAnimation
  } = (0, _react.useContext)(_AutocompleteDropdownContext.AutocompleteDropdownContext);
  const themeName = (0, _reactNative.useColorScheme)() || 'light';
  const styles = (0, _react.useMemo)(() => getStyles(themeName), [themeName]);
  (0, _react.useEffect)(() => {
    setLoading(loadingProp);
  }, [loadingProp]);
  const calculateDirection = (0, _react.useCallback)(async ({
    waitForKeyboard
  }) => {
    const [, positionY] = await new Promise(resolve => containerRef.current?.measureInWindow((...rect) => resolve(rect)));
    return new Promise(resolve => {
      setTimeout(() => {
        const kbHeight = _reactNative.Keyboard.metrics?.()?.height || 0;
        const screenHeight = _reactNative.Dimensions.get('window').height;
        setDirection((screenHeight - kbHeight) / 2 > positionY ? 'down' : 'up');
        resolve();
      }, waitForKeyboard ? _reactNative.Platform.select({
        ios: 600,
        android: 250,
        default: 1
      }) : 1 // wait for keyboard to show
      );
    });
  }, [setDirection]);
  const onClearPress = (0, _react.useCallback)(() => {
    setSearchText('');
    setInputValue('');
    setSelectedItem(null);
    setIsOpened(false);
    inputRef.current?.blur();
    if (typeof onClear === 'function') {
      onClear();
    }
  }, [onClear]);

  /** methods */
  const close = (0, _react.useCallback)(() => {
    setIsOpened(false);
    setContent(undefined);
  }, [setContent]);
  const blur = (0, _react.useCallback)(() => {
    inputRef.current?.blur();
  }, []);
  const open = (0, _react.useCallback)(async () => {
    if (directionProp) {
      setDirection(directionProp);
    } else {
      await calculateDirection({
        waitForKeyboard: !!inputRef.current?.isFocused()
      });
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 0);
  }, [calculateDirection, directionProp, setDirection]);
  const toggle = (0, _react.useCallback)(() => {
    isOpened ? close() : open();
  }, [close, isOpened, open]);
  const clear = (0, _react.useCallback)(() => {
    onClearPress();
  }, [onClearPress]);
  (0, _react.useLayoutEffect)(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else {
        ref.current = inputRef.current;
      }
    }
  }, [ref]);

  /** Set initial value */
  (0, _react.useEffect)(() => {
    const initialDataSet = initialDataSetRef.current;
    const initialValue = initialValueRef.current;
    let initialValueItem;
    if (typeof initialValue === 'string') {
      initialValueItem = initialDataSet?.find(el => el.id === initialValue);
    } else if (typeof initialValue === 'object' && initialValue.id) {
      initialValueItem = initialDataSet?.find(el => el.id === initialValue?.id);
      if (!initialValueItem) {
        // set the item as it is if it's not in the list
        initialValueItem = initialValue;
      }
    }
    if (initialValueItem) {
      setSelectedItem(initialValueItem);
    }
  }, []);
  (0, _react.useEffect)(() => {
    return () => {
      setContent(undefined);
      setIsOpened(false);
    };
  }, [setContent]);
  const setInputText = (0, _react.useCallback)(text => {
    setSearchText(text);
  }, []);
  const setItem = (0, _react.useCallback)(item => {
    setSelectedItem(item);
  }, []);
  (0, _react.useEffect)(() => {
    if (activeControllerRef?.current) {
      controllerRefs?.current.push(activeControllerRef?.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const closeAll = (0, _react.useCallback)(() => {
    controllerRefs?.current.forEach(c => {
      c?.blur?.();
      c?.close?.();
    });
  }, [controllerRefs]);

  /** expose controller methods */
  (0, _react.useEffect)(() => {
    const methods = activeControllerRef ? {
      close,
      blur,
      open,
      toggle,
      clear,
      setInputText,
      setItem
    } : null;
    if (activeControllerRef) {
      activeControllerRef.current = methods;
    }
    if (typeof controller === 'function') {
      controller(methods);
    } else if (controller) {
      controller.current = methods;
    }
  }, [blur, clear, close, controller, activeControllerRef, open, setInputText, setItem, toggle]);
  (0, _react.useEffect)(() => {
    if (selectedItem) {
      setInputValue(selectedItem.title ?? '');
    } else {
      setInputValue('');
    }
  }, [selectedItem]);
  (0, _react.useEffect)(() => {
    setInputValue(searchText);
  }, [searchText]);
  (0, _react.useEffect)(() => {
    if (typeof onSelectItemProp === 'function') {
      onSelectItemProp(selectedItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);
  (0, _react.useEffect)(() => {
    if (typeof onOpenSuggestionsListProp === 'function') {
      onOpenSuggestionsListProp(isOpened);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);
  (0, _react.useEffect)(() => {
    // renew state on close
    if (!isOpened && selectedItem && !loading && !inputRef.current?.isFocused()) {
      setInputValue(selectedItem.title || '');
    }
  }, [isOpened, loading, searchText, selectedItem]);
  const _onSelectItem = (0, _react.useCallback)(item => {
    setSelectedItem(item);
    inputRef.current?.blur();
    setIsOpened(false);
  }, []);
  (0, _react.useEffect)(() => {
    initialDataSetRef.current = dataSetProp;
    setDataSet(dataSetProp);
  }, [dataSetProp]);
  (0, _react.useEffect)(() => {
    const initialDataSet = initialDataSetRef.current;
    if (!searchText?.length) {
      setDataSet(initialDataSet);
      return;
    }
    if (!Array.isArray(initialDataSet) || useFilter === false) {
      return;
    }
    let findWhat = caseSensitive ? searchText : searchText.toLowerCase();
    if (ignoreAccents) {
      findWhat = (0, _diacriticless.default)(findWhat);
    }
    if (trimSearchText) {
      findWhat = findWhat.trim();
    }
    const newSet = initialDataSet.filter(item => {
      const titleStr = item.title || '';
      const title = caseSensitive ? titleStr : titleStr.toLowerCase();
      const findWhere = ignoreAccents ? (0, _diacriticless.default)(title) : title;
      if (matchFromStart) {
        return typeof item.title === 'string' && findWhere.startsWith(findWhat);
      } else {
        return typeof item.title === 'string' && findWhere.indexOf(findWhat) !== -1;
      }
    });
    setDataSet(newSet);
  }, [ignoreAccents, matchFromStart, caseSensitive, searchText, trimSearchText, useFilter]);
  const renderItem = (0, _react.useCallback)(({
    item,
    index
  }) => {
    const optionTestID = testID + "_Option_" + index;
    if (typeof customRenderItem === 'function') {
      const EL = customRenderItem(item, searchText);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
        testID: optionTestID,
        accessibilityLabel: optionTestID,
        accessible: false,
        onPress: () => _onSelectItem(item),
        children: EL
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ScrollViewListItem.ScrollViewListItem, {
      testID: optionTestID,
      title: item.title || '',
      highlight: searchText,
      style: suggestionsListTextStyle,
      onPress: () => _onSelectItem(item),
      ignoreAccents: ignoreAccents
    }, item.id);
  }, [_onSelectItem, customRenderItem, ignoreAccents, searchText, suggestionsListTextStyle]);
  const ListEmptyComponent = (0, _react.useMemo)(() => {
    return EmptyResultComponent ?? /*#__PURE__*/(0, _jsxRuntime.jsx)(_NothingFound.NothingFound, {
      emptyResultText: emptyResultText
    });
  }, [EmptyResultComponent, emptyResultText]);
  const debouncedEvent = (0, _react.useMemo)(() => (0, _lodash.default)(text => {
    if (typeof onTextChange === 'function') {
      onTextChange(text);
    }
    setLoading(false);
  }, debounceDelay), [debounceDelay, onTextChange]);
  const onChangeText = (0, _react.useCallback)(text => {
    setSearchText(text);
    setInputValue(text);
    setLoading(true);
    debouncedEvent(text);
  }, [debouncedEvent]);
  const onChevronPress = (0, _react.useCallback)(() => {
    toggle();
    _reactNative.Keyboard.dismiss();
    if (typeof onChevronPressProp === 'function') {
      onChevronPressProp();
    }
  }, [onChevronPressProp, toggle]);
  const onFocus = (0, _react.useCallback)(e => {
    if (clearOnFocus) {
      setSearchText('');
      setInputValue('');
    }
    if (typeof onFocusProp === 'function') {
      onFocusProp(e);
    }
    open();
  }, [clearOnFocus, onFocusProp, open]);
  const onBlur = (0, _react.useCallback)(e => {
    if (typeof onBlurProp === 'function') {
      onBlurProp(e);
    }
  }, [onBlurProp]);
  const onSubmit = (0, _react.useCallback)(e => {
    inputRef.current?.blur();
    if (closeOnSubmit) {
      close();
    }
    if (typeof onSubmitProp === 'function') {
      onSubmitProp(e);
    }
  }, [close, closeOnSubmit, onSubmitProp]);
  const onPressOut = (0, _react.useCallback)(e => {
    closeAll();
    if (editable) {
      inputRef?.current?.focus();
    } else {
      toggle();
    }
  }, [closeAll, editable, toggle]);
  (0, _react.useEffect)(() => {
    if (!content && !inputRef.current?.isFocused()) {
      const db = (0, _lodash.default)(() => {
        setIsOpened(false);
      }, 100);
      db();
      return () => {
        db.cancel();
      };
    }
  }, [content, loading]);
  (0, _react.useEffect)(() => {
    // searchTextRef
    if (searchText && inputRef.current?.isFocused() && !loading) {
      setIsOpened(true);
    }
  }, [loading, searchText]);
  (0, _react.useEffect)(() => {
    if (isOpened && Array.isArray(dataSet)) {
      configureAnimation();
      if (activeInputContainerRef) {
        activeInputContainerRef.current = containerRef.current;
      }
      setContent(/*#__PURE__*/(0, _jsxRuntime.jsx)(_Dropdown.Dropdown, {
        ...props,
        direction,
        inputHeight,
        dataSet,
        suggestionsListMaxHeight,
        renderItem,
        ListEmptyComponent
      }));
    } else {
      configureAnimation();
      setContent(undefined);
    }
  }, [ListEmptyComponent, activeInputContainerRef, dataSet, direction, inputHeight, isOpened, props, renderItem, setContent, suggestionsListMaxHeight]);
  const inputTestID = testID + "_Input";
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    onStartShouldSetResponder: () => true,
    onTouchEnd: e => {
      e.stopPropagation();
    },
    style: [styles.container, containerStyle],
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      ref: containerRef,
      onLayout: _ => {} // it's necessary use onLayout here for Androd (bug?)
      ,
      style: [styles.inputContainerStyle, inputContainerStyle],
      children: [LeftComponent, /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        style: styles.pressable,
        pointerEvents: _reactNative.Platform.select({
          ios: 'box-only',
          default: 'auto'
        }),
        onPressOut: onPressOut,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(InputComponent, {
          testID: inputTestID,
          accessibilityLabel: inputTestID,
          accessible: false,
          ref: inputRef,
          value: inputValue,
          onChangeText: onChangeText,
          autoCorrect: false,
          editable: editable,
          onBlur: onBlur,
          onFocus: onFocus,
          onSubmitEditing: onSubmit,
          placeholderTextColor: _theme.theme[themeName].inputPlaceholderColor,
          ...textInputProps,
          style: [styles.input, {
            height: inputHeight
          }, (textInputProps ?? {}).style]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_RightButton.RightButton, {
        testID: testID,
        isOpened: isOpened,
        inputHeight: inputHeight,
        onClearPress: onClearPress,
        onChevronPress: onChevronPress,
        showChevron: showChevron ?? true,
        showClear: showClear ?? (!!searchText || !!selectedItem),
        enableLoadingIndicator: enableLoadingIndicator,
        loading: loading,
        buttonsContainerStyle: rightButtonsContainerStyle,
        ChevronIconComponent: ChevronIconComponent,
        ClearIconComponent: ClearIconComponent,
        RightIconComponent: RightIconComponent,
        onRightIconComponentPress: onRightIconComponentPress
      })]
    })
  });
}));
const getStyles = (themeName = 'light') => _reactNativeSizeMatters.ScaledSheet.create({
  container: {
    marginVertical: 2
  },
  inputContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: _theme.theme[themeName].inputBackgroundColor,
    borderRadius: 5,
    overflow: 'hidden'
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'hidden',
    paddingHorizontal: 13,
    fontSize: 16,
    color: _theme.theme[themeName].inputTextColor
  },
  pressable: {
    flexGrow: 1,
    flexShrink: 1
  }
});
//# sourceMappingURL=index.js.map
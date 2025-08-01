"use strict";

import React, { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useContext } from 'react';
import debounce from 'lodash.debounce';
import { Dimensions, Keyboard, Platform, Pressable, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { Dropdown } from './Dropdown';
import { NothingFound } from './NothingFound';
import { RightButton } from './RightButton';
import { ScrollViewListItem } from './ScrollViewListItem';
import { AutocompleteDropdownContext, AutocompleteDropdownContextProvider } from './AutocompleteDropdownContext';
import diacriticless from './diacriticless';
import { theme } from './theme';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export * from './types';
export { AutocompleteDropdownContextProvider, AutocompleteDropdownContext };
export const AutocompleteDropdown = /*#__PURE__*/memo(/*#__PURE__*/forwardRef((props, ref) => {
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
    inputHeight = moderateScale(40, 0.2),
    suggestionsListMaxHeight = moderateScale(200, 0.2),
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
  const InputComponent = props.InputComponent || TextInput;
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(loadingProp);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpened, setIsOpened] = useStateIsOpened ?? useState(false);
  const initialDataSetRef = useRef(dataSetProp);
  const initialValueRef = useRef(initialValueProp);
  const [dataSet, setDataSet] = useState(dataSetProp);
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
  } = useContext(AutocompleteDropdownContext);
  const themeName = useColorScheme() || 'light';
  const styles = useMemo(() => getStyles(themeName), [themeName]);
  useEffect(() => {
    setLoading(loadingProp);
  }, [loadingProp]);
  const calculateDirection = useCallback(async ({
    waitForKeyboard
  }) => {
    const [, positionY] = await new Promise(resolve => containerRef.current?.measureInWindow((...rect) => resolve(rect)));
    return new Promise(resolve => {
      setTimeout(() => {
        const kbHeight = Keyboard.metrics?.()?.height || 0;
        const screenHeight = Dimensions.get('window').height;
        setDirection((screenHeight - kbHeight) / 2 > positionY ? 'down' : 'up');
        resolve();
      }, waitForKeyboard ? Platform.select({
        ios: 600,
        android: 250,
        default: 1
      }) : 1 // wait for keyboard to show
      );
    });
  }, [setDirection]);
  const onClearPress = useCallback(() => {
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
  const close = useCallback(() => {
    setIsOpened(false);
    setContent(undefined);
  }, [setContent]);
  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);
  const open = useCallback(async () => {
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
  const toggle = useCallback(() => {
    isOpened ? close() : open();
  }, [close, isOpened, open]);
  const clear = useCallback(() => {
    onClearPress();
  }, [onClearPress]);
  useLayoutEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else {
        ref.current = inputRef.current;
      }
    }
  }, [ref]);

  /** Set initial value */
  useEffect(() => {
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
  useEffect(() => {
    return () => {
      setContent(undefined);
      setIsOpened(false);
    };
  }, [setContent]);
  const setInputText = useCallback(text => {
    setSearchText(text);
  }, []);
  const setItem = useCallback(item => {
    setSelectedItem(item);
  }, []);
  useEffect(() => {
    if (activeControllerRef?.current) {
      controllerRefs?.current.push(activeControllerRef?.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const closeAll = useCallback(() => {
    controllerRefs?.current.forEach(c => {
      c?.blur?.();
      c?.close?.();
    });
  }, [controllerRefs]);

  /** expose controller methods */
  useEffect(() => {
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
  useEffect(() => {
    if (selectedItem) {
      setInputValue(selectedItem.title ?? '');
    } else {
      setInputValue('');
    }
  }, [selectedItem]);
  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);
  useEffect(() => {
    if (typeof onSelectItemProp === 'function') {
      onSelectItemProp(selectedItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);
  useEffect(() => {
    if (typeof onOpenSuggestionsListProp === 'function') {
      onOpenSuggestionsListProp(isOpened);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);
  useEffect(() => {
    // renew state on close
    if (!isOpened && selectedItem && !loading && !inputRef.current?.isFocused()) {
      setInputValue(selectedItem.title || '');
    }
  }, [isOpened, loading, searchText, selectedItem]);
  const _onSelectItem = useCallback(item => {
    setSelectedItem(item);
    inputRef.current?.blur();
    setIsOpened(false);
  }, []);
  useEffect(() => {
    initialDataSetRef.current = dataSetProp;
    setDataSet(dataSetProp);
  }, [dataSetProp]);
  useEffect(() => {
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
      findWhat = diacriticless(findWhat);
    }
    if (trimSearchText) {
      findWhat = findWhat.trim();
    }
    const newSet = initialDataSet.filter(item => {
      const titleStr = item.title || '';
      const title = caseSensitive ? titleStr : titleStr.toLowerCase();
      const findWhere = ignoreAccents ? diacriticless(title) : title;
      if (matchFromStart) {
        return typeof item.title === 'string' && findWhere.startsWith(findWhat);
      } else {
        return typeof item.title === 'string' && findWhere.indexOf(findWhat) !== -1;
      }
    });
    setDataSet(newSet);
  }, [ignoreAccents, matchFromStart, caseSensitive, searchText, trimSearchText, useFilter]);
  const renderItem = useCallback(({
    item,
    index
  }) => {
    const optionTestID = testID + "_Option_" + index;
    if (typeof customRenderItem === 'function') {
      const EL = customRenderItem(item, searchText);
      return /*#__PURE__*/_jsx(TouchableOpacity, {
        testID: optionTestID,
        accessibilityLabel: optionTestID,
        accessible: false,
        onPress: () => _onSelectItem(item),
        children: EL
      });
    }
    return /*#__PURE__*/_jsx(ScrollViewListItem, {
      testID: optionTestID,
      title: item.title || '',
      highlight: searchText,
      style: suggestionsListTextStyle,
      onPress: () => _onSelectItem(item),
      ignoreAccents: ignoreAccents
    }, item.id);
  }, [_onSelectItem, customRenderItem, ignoreAccents, searchText, suggestionsListTextStyle]);
  const ListEmptyComponent = useMemo(() => {
    return EmptyResultComponent ?? /*#__PURE__*/_jsx(NothingFound, {
      emptyResultText: emptyResultText
    });
  }, [EmptyResultComponent, emptyResultText]);
  const debouncedEvent = useMemo(() => debounce(text => {
    if (typeof onTextChange === 'function') {
      onTextChange(text);
    }
    setLoading(false);
  }, debounceDelay), [debounceDelay, onTextChange]);
  const onChangeText = useCallback(text => {
    setSearchText(text);
    setInputValue(text);
    setLoading(true);
    debouncedEvent(text);
  }, [debouncedEvent]);
  const onChevronPress = useCallback(() => {
    toggle();
    Keyboard.dismiss();
    if (typeof onChevronPressProp === 'function') {
      onChevronPressProp();
    }
  }, [onChevronPressProp, toggle]);
  const onFocus = useCallback(e => {
    if (clearOnFocus) {
      setSearchText('');
      setInputValue('');
    }
    if (typeof onFocusProp === 'function') {
      onFocusProp(e);
    }
    open();
  }, [clearOnFocus, onFocusProp, open]);
  const onBlur = useCallback(e => {
    if (typeof onBlurProp === 'function') {
      onBlurProp(e);
    }
  }, [onBlurProp]);
  const onSubmit = useCallback(e => {
    inputRef.current?.blur();
    if (closeOnSubmit) {
      close();
    }
    if (typeof onSubmitProp === 'function') {
      onSubmitProp(e);
    }
  }, [close, closeOnSubmit, onSubmitProp]);
  const onPressOut = useCallback(e => {
    closeAll();
    if (editable) {
      inputRef?.current?.focus();
    } else {
      toggle();
    }
  }, [closeAll, editable, toggle]);
  useEffect(() => {
    if (!content && !inputRef.current?.isFocused()) {
      const db = debounce(() => {
        setIsOpened(false);
      }, 100);
      db();
      return () => {
        db.cancel();
      };
    }
  }, [content, loading]);
  useEffect(() => {
    // searchTextRef
    if (searchText && inputRef.current?.isFocused() && !loading) {
      setIsOpened(true);
    }
  }, [loading, searchText]);
  useEffect(() => {
    if (isOpened && Array.isArray(dataSet)) {
      configureAnimation();
      if (activeInputContainerRef) {
        activeInputContainerRef.current = containerRef.current;
      }
      setContent(/*#__PURE__*/_jsx(Dropdown, {
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
  return /*#__PURE__*/_jsx(View, {
    onStartShouldSetResponder: () => true,
    onTouchEnd: e => {
      e.stopPropagation();
    },
    style: [styles.container, containerStyle],
    children: /*#__PURE__*/_jsxs(View, {
      ref: containerRef,
      onLayout: _ => {} // it's necessary use onLayout here for Androd (bug?)
      ,
      style: [styles.inputContainerStyle, inputContainerStyle],
      children: [LeftComponent, /*#__PURE__*/_jsx(Pressable, {
        style: styles.pressable,
        pointerEvents: Platform.select({
          ios: 'box-only',
          default: 'auto'
        }),
        onPressOut: onPressOut,
        children: /*#__PURE__*/_jsx(InputComponent, {
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
          placeholderTextColor: theme[themeName].inputPlaceholderColor,
          ...textInputProps,
          style: [styles.input, {
            height: inputHeight
          }, (textInputProps ?? {}).style]
        })
      }), /*#__PURE__*/_jsx(RightButton, {
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
const getStyles = (themeName = 'light') => ScaledSheet.create({
  container: {
    marginVertical: 2
  },
  inputContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme[themeName].inputBackgroundColor,
    borderRadius: 5,
    overflow: 'hidden'
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'hidden',
    paddingHorizontal: 13,
    fontSize: 16,
    color: theme[themeName].inputTextColor
  },
  pressable: {
    flexGrow: 1,
    flexShrink: 1
  }
});
//# sourceMappingURL=index.js.map
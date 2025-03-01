import React from 'react';
import type { SetStateAction, Dispatch, FC, ReactElement, MutableRefObject } from 'react';
import { View } from 'react-native';
import type { IAutocompleteDropdownRef } from './types';
export interface IAutocompleteDropdownContext {
    content?: ReactElement;
    setContent: Dispatch<SetStateAction<ReactElement | undefined>>;
    direction?: 'up' | 'down';
    setDirection: Dispatch<SetStateAction<IAutocompleteDropdownContext['direction']>>;
    activeInputContainerRef?: MutableRefObject<View | null>;
    activeControllerRef?: MutableRefObject<IAutocompleteDropdownRef | null>;
    controllerRefs?: MutableRefObject<IAutocompleteDropdownRef[]>;
    closeOnTouchEnd?: boolean;
    configureAnimation: () => void;
}
export interface IAutocompleteDropdownContextProviderProps {
    headerOffset?: number;
    children: React.ReactNode;
    closeOnTouchEnd?: boolean;
}
export declare const AutocompleteDropdownContext: React.Context<IAutocompleteDropdownContext>;
export declare const AutocompleteDropdownContextProvider: FC<IAutocompleteDropdownContextProviderProps>;
//# sourceMappingURL=AutocompleteDropdownContext.d.ts.map
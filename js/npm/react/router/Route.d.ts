import React from 'react';
import { StringMask } from '../../../router';
export type RouteStatus = 'entering' | 'leaving' | 'visible' | 'invisible';
export declare const RouteStateContext: any;
export interface RouteProps {
    path: StringMask;
    excludePath?: StringMask;
    search?: StringMask;
    hash?: StringMask;
    exact?: boolean;
    strict?: boolean;
    transitionDuration?: number;
    children?: React.ReactNode;
    debug?: boolean;
}
export declare const Route: ({ path, excludePath, hash, search, exact, strict, transitionDuration, children, debug, }: RouteProps) => any;

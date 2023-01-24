import React from 'react';
import { Observable } from '../../../observables';
import { Destroyable } from './destroyable';
export type ComplexEffectsState = {
    mounted: boolean;
};
export type ComplexEffectsDependencyList = React.DependencyList | 'always-recalculate';
/**
 * @deprecated `useEffects` should be preferred over this.
 *
 * Using generator to allow multiple "on destroy" callbacks.
 *
 * Callbacks are return with "`yield`".
 *
 * Internally uses `React.useLayoutEffect` by default.
 *
 * Usage:
 *
 * ```js
 * useComplexEffects(function* () {
 *   subscribe(username)
 *   yield () => unsubscribe(username)
 *
 *   const onScroll = () => doSomethingCool(username)
 *   window.addEventListener('scroll', onScroll)
 *   yield () => window.removeEventListener('scroll', onScroll)
 * }, [username])
 * ```
 */
export declare function useComplexEffects<T = void>(complexEffects: (state: ComplexEffectsState) => Generator<Destroyable, T>, deps: ComplexEffectsDependencyList, { debug, useLayoutEffect }?: {
    debug?: string | undefined;
    useLayoutEffect?: boolean | undefined;
}): any;
/**
 * @deprecated `useEffects` should be preferred over this.
 *
 * Same as `useComplexEffects` but with a ref (short-hand).
 */
export declare function useRefComplexEffects<T = HTMLElement>(complexEffects: (current: T, state: ComplexEffectsState) => Generator<Destroyable>, deps: ComplexEffectsDependencyList): any;
export declare function useForceUpdate({ waitNextFrame, }: {
    waitNextFrame: boolean;
}): any;
type UseObservableOption<T, O extends Observable<T>, U> = Partial<{
    useValueOld: boolean;
    extract: (o: O) => U;
}>;
export declare function useObservable<T>(observable: Observable<T>): T;
export declare function useObservable<T, O extends Observable<any> = Observable<T>, U = any>(observable: O, options: UseObservableOption<T, O, U>): U;
export declare function useFetchText(url: string): string | null;
export declare function useFetchText(url: string, initialValue: string): string;
export declare function useFetchJson<T = any>(url: string): T | null;
export declare function useFetchJson<T = any>(url: string, initialValue: T): T;
export declare function useAnimationFrame(callback: (ms: number) => void): void;
export declare const usePromise: <T>(getPromise: Promise<T> | (() => Promise<T>), deps?: React.DependencyList) => any;
/**
 * You know it. Sometimes you're not still there when a response arrive. So
 * useSafeState does not anything if the component is already unmounted.
 * @param initialValue The... initial value!
 * @returns
 */
export declare const useSafeState: <T>(initialValue: T) => [T, (value: T) => void];
export {};

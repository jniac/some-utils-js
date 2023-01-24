import { RefObject } from 'react';
import { Destroyable } from './destroyable';
declare const mountCheck = "mounted?";
type CallbackMoment = 'effect' | 'layout-effect' | 'memo';
type UseEffectOptions = Partial<{
    moment: CallbackMoment;
}>;
type PublicState<T> = {
    readonly mounted: boolean;
    ref: RefObject<T>;
};
/**
 * `useEffects` is intended to allow the complex declaration of multiple, potentially async effects.
 *
 * Usage:
 * ```tsx
 * const MyComp = () => {
 *   const { ref } = useEffects<HTMLDivElement>(async function* (div, state) {
 *     const value = await fetch(something)
 *     yield 'mounted?'
 *     yield subscribeSomething(value)
 *     await waitSeconds(30)
 *     yield 'mounted?'
 *     dispatch('Are you still there?')
 *   })
 *   return (
 *     <div ref={ref} />
 *   )
 * }
 * ```
 *
 * NOTE:
 *
 * `useEffects` is an evolution of `useComplexEffects` & `useRefComplexEffects`
 * and should be preferred over these two.
 */
export declare function useEffects<T = undefined>(effect: (value: T, state: PublicState<T>) => void | Generator<Destroyable | typeof mountCheck> | AsyncGenerator<Destroyable | typeof mountCheck>, deps: any[] | 'always-recalculate', { moment }?: UseEffectOptions): any;
/**
 * Exactly the same function than useEffects, but with the option "moment"
 * set to "layout-effect" (callback is executed ["before the browser has any chance to paint"](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)).
 * @param effect
 * @param deps
 * @returns
 */
export declare function useLayoutEffects<T = undefined>(effect: Parameters<typeof useEffects<T>>[0], deps: Parameters<typeof useEffects<T>>[1]): any;
export {};

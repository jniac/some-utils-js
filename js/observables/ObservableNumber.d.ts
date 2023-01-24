import { IntervalParams } from '../geom';
import { Observable, ObservableCallback } from './Observable';
export declare class ObservableNumber extends Observable<number> {
    #private;
    constructor(initialValue: number, { min, max }?: {
        min?: number | undefined;
        max?: number | undefined;
    });
    setMinMax(min: number, max: number, { ignoreCallbacks, owner, }?: {
        ignoreCallbacks?: boolean | undefined;
        owner?: any;
    }): boolean;
    getMin(): number;
    setMin(value: number, { ignoreCallbacks, owner, }?: {
        ignoreCallbacks?: boolean | undefined;
        owner?: any;
    }): boolean;
    getMax(): number;
    setMax(value: number, { ignoreCallbacks, owner, }?: {
        ignoreCallbacks?: boolean | undefined;
        owner?: any;
    }): boolean;
    clamp(value: number): number;
    setValue(value: number | ((v: number) => number), { ignoreCallbacks, owner, }?: {
        ignoreCallbacks?: boolean | undefined;
        owner?: any;
    }): boolean;
    /**
     * Shorthand for `obs.setValue(obs.value + delta)`
     */
    increment(delta: number | ((v: number) => number), { ignoreCallbacks, owner, }?: {
        ignoreCallbacks?: boolean | undefined;
        owner?: any;
    }): boolean;
    get delta(): number;
    passedAbove(threshold: number): boolean;
    passedBelow(threshold: number): boolean;
    passedThrough(threshold: number): boolean;
    onPassAbove(threshold: number, callback: ObservableCallback<number, ObservableNumber>): import("./Observable").Destroyable;
    onPassBelow(threshold: number, callback: ObservableCallback<number, ObservableNumber>): import("./Observable").Destroyable;
    onPassThrough(threshold: number, callback: ObservableCallback<number, ObservableNumber>): import("./Observable").Destroyable;
    onStepChange(step: number, callback: ObservableCallback<number, ObservableNumber>, { execute, once }?: {
        execute?: boolean | undefined;
        once?: boolean | undefined;
    }): import("./Observable").Destroyable;
    /**
     * Alias for `onStepChange(cb, { execute: true })`
     */
    withStepValue(step: number, callback: ObservableCallback<number, ObservableNumber>, { once }?: {
        once?: boolean | undefined;
    }): import("./Observable").Destroyable;
    onInterval({ interval, ...props }: {
        interval: IntervalParams;
        onEnter?: ObservableCallback<number>;
        onLeave?: ObservableCallback<number>;
        onInnerChange?: ObservableCallback<number>;
        onOuterChange?: ObservableCallback<number>;
        execute?: boolean;
        once?: boolean;
    }): import("./Observable").Destroyable;
    almostEquals(value: number, tolerance?: number): boolean;
    almostEquals(value: number, options?: {
        tolerance: number;
    }): boolean;
}

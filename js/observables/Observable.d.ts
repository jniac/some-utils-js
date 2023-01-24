export declare const ONCE: unique symbol;
export type Destroyable = {
    destroy: () => void;
};
export type ObservableCallback<T, O extends Observable<T> = Observable<T>> = (value: T, target: O) => (void | any | typeof ONCE);
export type SetValueOptions = {
    ignoreCallbacks?: boolean;
    owner?: any;
};
export type WhenOptionA<T> = {
    enter?: ObservableCallback<T>;
    leave?: ObservableCallback<T>;
    every?: ObservableCallback<T>;
};
export type WhenOptionB<T> = (target: Observable<T>) => {
    destroy: () => void;
};
export declare class Observable<T> {
    #private;
    private static count;
    readonly id: number;
    get value(): T;
    set value(value: T);
    get valueOld(): T;
    get hasChanged(): boolean;
    get owner(): any;
    own(owner: any): void;
    get destroyed(): boolean;
    destroy: () => void;
    ignoreCallbacks: boolean;
    constructor(initialValue: T);
    /**
     * For inner / protected usage only.
     */
    _setValue(value: T): void;
    /**
     * For inner / protected usage only.
     */
    _setValueOld(value: T): void;
    /**
     * For inner / protected usage only.
     * Make sense with "object" values only (avoid a deep copy).
     */
    _permuteValues(): void;
    /**
     * For inner / protected usage only.
     */
    _setHasChanged(value: boolean): void;
    setValue(value: T | ((v: T) => T), { ignoreCallbacks, owner, }?: SetValueOptions): boolean;
    /**
     * NOTE: triggerChangeCallbacks() allows to defer the callbacks call (eg: after
     * further / other changes). Since this break the implicit contract of "onChange"
     * callbacks (that should be called only when the value has changed), this should
     * be used very carefully.
     */
    triggerChangeCallbacks({ force }?: {
        force?: boolean | undefined;
    }): void;
    /**
     * @deprecated
     * Should not exists. Here because used somewhere.
     */
    clearCallbacks(): void;
    /**
     * Returns all the callbacks, for debug purpose huh. Future implementation may
     * return null here, for security reasons.
     */
    getAllCallbacksForDebugPurpose(): Set<ObservableCallback<T, Observable<T>>>;
    /**
     * Change the value, but not immediately. Any intermediate changes will prevent
     * that futur change (allowing an interesting design where long terms changes
     * can be overrided by more urgent changes).
     *
     * Uses internally `setTimeout`.
     */
    setValueWithDelay(value: T | ((v: T) => T), seconds: number, { clearOnChange, clearPrevious, }?: {
        clearOnChange?: boolean | undefined;
        clearPrevious?: boolean | undefined;
    }): void;
    onChange(callback: ObservableCallback<T>, { execute, once }?: {
        execute?: boolean | undefined;
        once?: boolean | undefined;
    }): Destroyable;
    /**
     * Alias for `onChange(cb, { execute: true })`
     */
    withValue(callback: ObservableCallback<T>, { once }?: {
        once?: boolean | undefined;
    }): Destroyable;
    withNonNullableValue(callback: ObservableCallback<NonNullable<T>>, { once }?: {
        once?: boolean | undefined;
    }): Destroyable;
    onValue(ref: T, callback: ObservableCallback<T>, { execute, once }?: {
        execute?: boolean | undefined;
        once?: boolean | undefined;
    }): Destroyable;
    onDestroy(callback: ObservableCallback<T>): void;
    /**
     * Two callback options:
     * - A: enter / leave / every
     * - B: callback that returns a destroyable
     *
     *
     * Option A details:
     * - `enter()` is called when the first time the predicate returns true afer returning false
     * - `every()` is called every time the predicates returns true
     * - `leave()` is called when the first time the predicate returns false afer returning true
     *
     * Option B allows declarative callback declaration:
     * ```js
     * const obs = new Observable(3)
     * obs.when(v => v >= 1 && v < 2, () => someOtherObs.onChange(doSomething)))
     * ```
     */
    when(predicate: (value: T) => boolean, option: WhenOptionA<T> | WhenOptionB<T>): Destroyable;
    onVerify({ verify, onEnter, onLeave, onInnerChange, onOuterChange, execute, once }: {
        verify: (value: T) => boolean;
        onEnter?: ObservableCallback<T>;
        onLeave?: ObservableCallback<T>;
        onInnerChange?: ObservableCallback<T>;
        onOuterChange?: ObservableCallback<T>;
        execute?: boolean;
        once?: boolean;
    }): Destroyable;
    child<U>(predicate: (v: Observable<T>) => U): Observable<U>;
    logOnChange(name: string): Destroyable;
}

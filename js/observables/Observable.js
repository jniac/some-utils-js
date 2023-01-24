import { setValueWithDelay } from './utils/delay';
export const ONCE = Symbol('ONCE');
class DestroyedObservable {
    static errorMessage = `This observable has been destroyed.\nYou should not use it anymore. "onDestroy" callback helps to prevent any usage after destruction.`;
    setValue() {
        throw new Error(DestroyedObservable.errorMessage);
    }
    setValueWithDelay() {
        throw new Error(DestroyedObservable.errorMessage);
    }
    onChange() {
        throw new Error(DestroyedObservable.errorMessage);
    }
    onValue() {
        throw new Error(DestroyedObservable.errorMessage);
    }
    useValue() {
        throw new Error(DestroyedObservable.errorMessage);
    }
    onDestroy() {
        throw new Error(DestroyedObservable.errorMessage);
    }
    destroy() {
        throw new Error(DestroyedObservable.errorMessage);
    }
    get destroyed() { return true; }
}
export class Observable {
    static count = 0;
    id = Observable.count++;
    #onChange = new Set();
    #onDestroy = new Set();
    #value;
    get value() { return this.#value; }
    set value(value) { this.setValue(value); }
    #valueOld;
    get valueOld() { return this.#valueOld; }
    #hasChanged = false;
    get hasChanged() { return this.#hasChanged; }
    #owner = null;
    get owner() { return this.#owner; }
    own(owner) {
        if (this.#owner !== null) {
            throw new Error(`Ownership has already been set.`);
        }
        this.#owner = owner;
    }
    get destroyed() { return false; }
    destroy;
    ignoreCallbacks = false;
    constructor(initialValue) {
        this.#valueOld = initialValue;
        this.#value = initialValue;
        // NOTE: destroy here change the prototype of "this". This is critical but helps 
        // here to prevent any usage of the current observable after destruction.
        // Could be remove, if considered as "too bad".
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
        this.destroy = () => {
            const value = this.#value;
            for (const callback of this.#onDestroy) {
                callback(value, this);
            }
            this.#onChange.clear();
            this.#onDestroy.clear();
            Object.setPrototypeOf(this, DestroyedObservable.prototype);
            //@ts-ignore
            delete this.destroy;
            Object.freeze(this);
        };
    }
    /**
     * For inner / protected usage only.
     */
    _setValue(value) {
        this.#value = value;
    }
    /**
     * For inner / protected usage only.
     */
    _setValueOld(value) {
        this.#valueOld = value;
    }
    /**
     * For inner / protected usage only.
     * Make sense with "object" values only (avoid a deep copy).
     */
    _permuteValues() {
        const tmp = this.#value;
        this.#value = this.#valueOld;
        this.#valueOld = tmp;
    }
    /**
     * For inner / protected usage only.
     */
    _setHasChanged(value) {
        this.#hasChanged = value;
    }
    setValue(value, { ignoreCallbacks = false, owner = null, } = {}) {
        if (this.#owner !== owner) {
            throw new Error(`Value cannot be changed with an invalid "owner" value.`);
        }
        if (typeof value === 'function') {
            value = value(this.#value);
        }
        this.#hasChanged = this.#value !== value;
        if (this.#hasChanged) {
            this.#valueOld = this.#value;
            this.#value = value;
            if (ignoreCallbacks === false && this.ignoreCallbacks === false) {
                const toRemoveCallbacks = new Set();
                for (const callback of this.#onChange) {
                    const returnValue = callback(value, this);
                    if (returnValue === ONCE) {
                        toRemoveCallbacks.add(callback);
                    }
                }
                for (const callback of toRemoveCallbacks) {
                    this.#onChange.delete(callback);
                }
            }
        }
        return this.#hasChanged;
    }
    /**
     * NOTE: triggerChangeCallbacks() allows to defer the callbacks call (eg: after
     * further / other changes). Since this break the implicit contract of "onChange"
     * callbacks (that should be called only when the value has changed), this should
     * be used very carefully.
     */
    triggerChangeCallbacks({ force = false } = {}) {
        if (this.#hasChanged || force) {
            const value = this.#value;
            for (const callback of this.#onChange) {
                callback(value, this);
            }
        }
    }
    /**
     * @deprecated
     * Should not exists. Here because used somewhere.
     */
    clearCallbacks() {
        this.#onChange.clear();
    }
    /**
     * Returns all the callbacks, for debug purpose huh. Future implementation may
     * return null here, for security reasons.
     */
    getAllCallbacksForDebugPurpose() {
        return this.#onChange;
    }
    /**
     * Change the value, but not immediately. Any intermediate changes will prevent
     * that futur change (allowing an interesting design where long terms changes
     * can be overrided by more urgent changes).
     *
     * Uses internally `setTimeout`.
     */
    setValueWithDelay(value, seconds, { clearOnChange = true, clearPrevious = true, } = {}) {
        setValueWithDelay(this, value, seconds, clearOnChange, clearPrevious);
    }
    onChange(callback, { execute = false, once = false } = {}) {
        if (once) {
            return this.onChange(value => {
                callback(value, this);
                return ONCE;
            }, { execute, once: false });
        }
        this.#onChange.add(callback);
        if (execute) {
            callback(this.#value, this);
        }
        const destroy = () => { this.#onChange.delete(callback); };
        return { destroy };
    }
    /**
     * Alias for `onChange(cb, { execute: true })`
     */
    withValue(callback, { once = false } = {}) {
        return this.onChange(callback, { execute: true, once });
    }
    withNonNullableValue(callback, { once = false } = {}) {
        return this.onChange(value => {
            if (value !== null && value !== undefined) {
                callback(value, this);
                if (once) {
                    return ONCE;
                }
            }
        }, { execute: true, once: false });
    }
    onValue(ref, callback, { execute = false, once = false } = {}) {
        return this.onChange(() => {
            if (this.#value === ref) {
                callback(ref, this);
            }
        }, { execute, once });
    }
    onDestroy(callback) {
        this.#onDestroy.add(callback);
    }
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
    when(predicate, option) {
        if (typeof option === 'function') {
            let destroyable = null;
            return this.when(predicate, {
                enter: () => {
                    destroyable = option(this);
                },
                leave: () => {
                    destroyable?.destroy();
                },
            });
        }
        const { enter, leave, every, } = option;
        let ok = predicate(this.#value);
        if (ok) {
            enter?.(this.#value, this);
            every?.(this.#value, this);
        }
        return this.onChange(value => {
            const okNew = predicate(value);
            every?.(value, this);
            if (ok !== okNew) {
                ok = okNew;
                if (ok) {
                    enter?.(value, this);
                }
                else {
                    leave?.(value, this);
                }
            }
        });
    }
    onVerify({ verify, onEnter, onLeave, onInnerChange, onOuterChange, execute, once }) {
        let entered = false;
        return this.onChange((value) => {
            const enteredOld = entered;
            entered = verify(value);
            if (enteredOld !== entered) {
                if (entered) {
                    onEnter?.(value, this);
                }
                if (entered === false) {
                    onLeave?.(value, this);
                }
            }
            if (entered) {
                onInnerChange?.(value, this);
            }
            if (entered === false) {
                onOuterChange?.(value, this);
            }
        }, { execute, once });
    }
    child(predicate) {
        const child = new Observable(predicate(this));
        const { destroy } = this.onChange(() => {
            child.setValue(() => predicate(this));
        });
        child.onDestroy(destroy);
        return child;
    }
    // utils
    logOnChange(name) {
        return this.onChange(() => {
            console.log(`"${name}" has changed: ${this.value} (previous: ${this.valueOld})`);
        });
    }
}

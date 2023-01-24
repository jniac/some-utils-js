import { Interval } from '../geom.js';
import { Observable } from './Observable.js';
export class ObservableNumber extends Observable {
    #min;
    #max;
    constructor(initialValue, { min = -Infinity, max = Infinity } = {}) {
        super(initialValue);
        this.#min = min;
        this.#max = max;
    }
    setMinMax(min, max, { ignoreCallbacks = false, owner = null, } = {}) {
        if (min > this.#max) {
            this.#max = min;
        }
        if (max < this.#min) {
            this.#min = max;
        }
        this.#min = min;
        this.#max = max;
        return this.setValue(this.value, { ignoreCallbacks, owner });
    }
    getMin() { return this.#min; }
    setMin(value, { ignoreCallbacks = false, owner = null, } = {}) {
        return this.setMinMax(value, this.#max, { ignoreCallbacks, owner });
    }
    getMax() { return this.#max; }
    setMax(value, { ignoreCallbacks = false, owner = null, } = {}) {
        return this.setMinMax(this.#min, value, { ignoreCallbacks, owner });
    }
    clamp(value) {
        return value < this.#min ? this.#min : value > this.#max ? this.#max : value;
    }
    setValue(value, { ignoreCallbacks = false, owner = null, } = {}) {
        if (typeof value === 'function') {
            value = value(this.value);
        }
        value = this.clamp(value);
        return super.setValue(value, { ignoreCallbacks, owner });
    }
    /**
     * Shorthand for `obs.setValue(obs.value + delta)`
     */
    increment(delta, { ignoreCallbacks = false, owner = null, } = {}) {
        if (typeof delta === 'function') {
            delta = delta(this.value);
        }
        return this.setValue(this.value + delta, { ignoreCallbacks, owner });
    }
    get delta() { return this.value - this.valueOld; }
    passedAbove(threshold) {
        return this.valueOld < threshold && this.value >= threshold;
    }
    passedBelow(threshold) {
        return this.valueOld > threshold && this.value <= threshold;
    }
    passedThrough(threshold) {
        return this.passedBelow(threshold) || this.passedAbove(threshold);
    }
    onPassAbove(threshold, callback) {
        return this.onChange(() => {
            if (this.passedAbove(threshold)) {
                callback(this.value, this);
            }
        });
    }
    onPassBelow(threshold, callback) {
        return this.onChange(() => {
            if (this.passedBelow(threshold)) {
                callback(this.value, this);
            }
        });
    }
    onPassThrough(threshold, callback) {
        return this.onChange(() => {
            if (this.passedThrough(threshold)) {
                callback(this.value, this);
            }
        });
    }
    onStepChange(step, callback, { execute = false, once = false } = {}) {
        let currentValue = NaN;
        return this.onChange((value) => {
            let newValue = Math.round(value / step) * step;
            if (currentValue !== newValue) {
                currentValue = newValue;
                callback(currentValue, this);
            }
        }, { execute, once });
    }
    /**
     * Alias for `onStepChange(cb, { execute: true })`
     */
    withStepValue(step, callback, { once = false } = {}) {
        return this.onStepChange(step, callback, { execute: true, once });
    }
    onInterval({ interval, ...props }) {
        const _interval = Interval.ensure(interval);
        return this.onVerify({
            verify: value => _interval.containsValue(value),
            ...props,
        });
    }
    almostEquals(value, options) {
        const tolerance = (typeof options === 'number' ? options : options?.tolerance) ?? 1e-9;
        return Math.abs(this.value - value) <= tolerance;
    }
}

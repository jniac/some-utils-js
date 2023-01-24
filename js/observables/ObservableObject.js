import { deepClone, deepPartialEquals, deepPartialCopy, deepGet } from '../object/clone.js';
import { Observable } from './Observable.js';
/**
 * Tricky concept.
 *
 * Be aware that valueOld only refers to the previous last change state.
 * This won't work:
 *
 * ```
 * const x = new ObservableObject({ name: 'foo', age: 7 })
 * x.updateValue({ age: 8 })
 * x.valueOld.age // 7 (ok)
 * x.updateValue({ name: 'bar })
 * x.valueOld.age // 8 (ok but expected?)
 * ```
 */
export class ObservableObject extends Observable {
    constructor(initialValue) {
        super(initialValue);
        this._setValueOld(deepClone(initialValue));
    }
    /**
     * Same as setValue but WITHOUT changing the inner value reference, but its properties only (deep copy).
     */
    updateValue(value, { ignoreCallbacks = false, owner = null } = {}) {
        if (this.owner !== owner) {
            throw new Error(`Value cannot be changed with an invalid "owner" value.`);
        }
        if (typeof value === 'function') {
            value = value(this.value);
        }
        const hasChanged = deepPartialEquals(value, this.value) === false;
        if (hasChanged) {
            this._setValueOld(deepClone(this.value));
            deepPartialCopy(value, this.value);
            this._setHasChanged(hasChanged);
            if (ignoreCallbacks === false && this.ignoreCallbacks === false) {
                this.triggerChangeCallbacks();
            }
        }
        return hasChanged;
    }
    getPropValue(path) {
        return deepGet(this.value, path);
    }
    onPropChange(path, callback) {
        let valueOld = this.getPropValue(path);
        return this.onChange(() => {
            const value = this.getPropValue(path);
            if (value !== valueOld) {
                callback(value, valueOld, this);
                valueOld = value;
            }
        });
    }
}

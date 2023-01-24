import { bitmask } from './utils/bitmask-16';
import { Observable } from './Observable';
export class ObservableBitmask16 extends Observable {
    constructor(initialMask) {
        super(bitmask.apply(initialMask, 0));
    }
    test(mask) {
        return bitmask.compare(mask, this.value);
    }
    maskChanged(mask) {
        return (bitmask.compare(mask, this.value) !== bitmask.compare(mask, this.valueOld));
    }
    onMaskChange(mask, callback, { execute = false } = {}) {
        return this.onChange(() => {
            const match = bitmask.compare(mask, this.value);
            const matchOld = bitmask.compare(mask, this.valueOld);
            if (match !== matchOld) {
                callback(match);
            }
        }, { execute });
    }
    toggle(mask, mode = 'normal', options) {
        if (typeof mode === 'boolean') {
            mode = mode ? 'normal' : 'inverse';
        }
        if (mode === 'toggle') {
            mode = bitmask.compare(mask, this.value) ? 'inverse' : 'normal';
        }
        if (mode === 'inverse') {
            mask = bitmask.invert(mask);
        }
        this.setValue(bitmask.apply(mask, this.value), options);
    }
}

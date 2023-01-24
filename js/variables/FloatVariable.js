import { toSvgDocumentString, toSvgString } from './FloatVariable-svg.js';
export class FloatVariable {
    #derivative = null;
    #array;
    #index = 0;
    #sum;
    constructor(initialValue, { size = 16, floatSize = 64, derivativeCount = 0, } = {}) {
        this.#array = floatSize === 32 ? new Float32Array(size) : new Float64Array(size);
        this.fill(initialValue);
        if (derivativeCount > 0) {
            this.#derivative = new FloatVariable(0, { size, floatSize, derivativeCount: derivativeCount - 1 });
        }
    }
    getMin() {
        const array = this.#array;
        const size = array.length;
        let value = array[0];
        for (let i = 1; i < size; i++) {
            value = Math.min(value, array[i]);
        }
        return value;
    }
    getMax() {
        const array = this.#array;
        const size = array.length;
        let value = array[0];
        for (let i = 1; i < size; i++) {
            value = Math.max(value, array[i]);
        }
        return value;
    }
    *values() {
        const array = this.#array;
        const index = this.#index;
        const size = array.length;
        for (let i = 0; i < size; i++) {
            const valueIndex = (index - i + size) % size;
            yield array[valueIndex];
        }
    }
    /**
     * Returns an array in the "right" order.
     */
    getArray(out = null) {
        const array = this.#array;
        const index = this.#index;
        const size = array.length;
        if (out === null) {
            out = this.floatSize === 32 ? new Float32Array(size) : new Float64Array(size);
        }
        if (out.length !== size) {
            throw new Error(`Invalid size.`);
        }
        for (let i = 0; i < size; i++) {
            const valueIndex = (index - i + size) % size;
            out[i] = array[valueIndex];
        }
        return out;
    }
    fill(value) {
        const size = this.#array.length;
        this.#sum = value * size;
        for (let i = 0; i < size; i++) {
            this.#array[i] = value;
        }
        if (this.#derivative) {
            this.#derivative.fill(0);
        }
        return this;
    }
    setValue(value, asNewValue) {
        const array = this.#array;
        const index = this.#index;
        const size = array.length;
        if (this.#derivative) {
            const valueOld = array[index];
            const delta = value - valueOld;
            this.#derivative.setValue(delta, asNewValue);
        }
        const indexNew = asNewValue ? (index + 1 < size ? index + 1 : 0) : index;
        this.#sum += value - array[indexNew];
        // At the end, update:
        array[indexNew] = value;
        this.#index = indexNew;
        return this;
    }
    setCurrentValue(value) {
        return this.setValue(value, false);
    }
    setNewValue(value) {
        return this.setValue(value, true);
    }
    toString({ precision = 2, floatMaxCount = 16 } = {}) {
        const array = this.#array;
        const index = this.#index;
        const size = array.length;
        const data = Array.from({ length: size })
            .map((_, i) => array[(index - i + size * 2) % size])
            .map(x => x.toFixed(precision))
            .join(', ');
        const tab = '  ';
        const trunc = floatMaxCount < size ? ', ...' : '';
        return (`FloatVariable<${size}, f${this.floatSize}, d:${this.derivativeCount}>` +
            `\n${tab}sum: ${this.sum.toFixed(precision)}, average: ${this.average.toFixed(precision + 2)}` +
            `\n${tab}[${data}${trunc}]`);
    }
    toSvgString(param) {
        return toSvgString(this, param);
    }
    toSvgDocumentString() {
        return toSvgDocumentString(this);
    }
    toSvgElement() {
        if (typeof window === 'undefined') {
            throw new Error(`Cannot create an svg element without an access to {window}`);
        }
        const div = window.document.createElement('div');
        div.innerHTML = this.toSvgString();
        const svg = div.querySelector('svg');
        return svg;
    }
    openSvgDocument() {
        if (typeof window === 'undefined') {
            throw new Error(`Cannot create an svg element without an access to {window}`);
        }
        const win = window.open('about:blank', '_blank');
        win.document.write(this.toSvgDocumentString());
        return win;
    }
    get min() { return this.getMin(); }
    get max() { return this.getMax(); }
    get size() { return this.#array.length; }
    get floatSize() { return this.#array instanceof Float32Array ? 32 : 64; }
    get value() { return this.#array[this.#index]; }
    get newValue() { return this.#array[this.#index]; }
    set newValue(value) { this.setNewValue(value); }
    get currentValue() { return this.#array[this.#index]; }
    set currentValue(value) { this.setCurrentValue(value); }
    get sum() { return this.#sum; }
    get average() { return this.#sum / this.#array.length; }
    get derivative() { return this.#derivative; }
    get derivativeCount() { return this.#derivative ? this.#derivative.derivativeCount + 1 : 0; }
    get array() { return this.getArray(); }
}

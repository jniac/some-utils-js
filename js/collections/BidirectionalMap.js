/**
 * Guess what? It is as the name suggests, it's a... bidirectionnal map.
 *
 * Keys may be retrieved from a value:
 * ```
 * bm.set(3, 'three')
 * bm.getValue(3) // "three"
 * bm.getKey('three') //  3
 * ```
 */
export class BidirectionalMap {
    #keys = new Map();
    #values = new Map();
    set(key, value) {
        this.#keys.set(key, value);
        this.#values.set(value, key);
    }
    getValue(key) {
        return this.#keys.get(key);
    }
    getKey(value) {
        return this.#values.get(value);
    }
    clear() {
        this.#keys.clear();
        this.#values.clear();
    }
    get keyCount() { return this.#keys.size; }
    get valueCount() { return this.#values.size; }
}

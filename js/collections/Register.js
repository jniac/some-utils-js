/**
 * A collection of sets, indexed by a key (any). It's like a `Map`, but with
 * potentially multiples values for a key.
 *
 * Useful for storing data about a "target".
 *
 * Example:
 * ```
 * type events = 'Enter' | 'Exit'
 * const listeners = new Register<events, () => void>()
 *
 * listeners.add('Enter', () => console.log('Hi!'))
 * listeners.add('Enter', () => console.log('Welcome'))
 * listeners.add('Enter', () => console.log('Bonjour'))
 *
 * for (const listener of listeners.valuesOf('Enter')) {
 *   listener()
 * }
 *
 * // "Hi!"
 * // "Welcome"
 * // "Bonjour"
 * ```
 */
export class Register {
    #map = new Map();
    get keyCount() { return this.#map.size; }
    add(key, value) {
        const create = () => {
            const set = new Set();
            this.#map.set(key, set);
            return set;
        };
        const set = this.#map.get(key) ?? create();
        set.add(value);
    }
    /** @obsolete Alias for `delete(k, v)`.  */
    remove(key, value) { return this.delete(key, value); }
    /** Delete an entry. */
    delete(key, value) {
        const set = this.#map.get(key);
        if (set) {
            const ok = set.delete(value);
            if (ok && set.size === 0) {
                this.#map.delete(key);
                return 0;
            }
            return set.size;
        }
        return -1;
    }
    /** @obsolete Alias for `deleteAll(k)`.  */
    removeAll(key) { return this.deleteAll(key); }
    /** Delete all entries of the given key. */
    deleteAll(key) {
        return this.#map.delete(key);
    }
    get(key) {
        return this.#map.get(key);
    }
    keys() {
        return this.#map.keys();
    }
    *entries() {
        for (const [key, set] of this.#map.entries()) {
            for (const value of set) {
                yield [key, value];
            }
        }
    }
    *values() {
        for (const set of this.#map.values()) {
            yield* set;
        }
    }
    *valuesOf(key) {
        const set = this.#map.get(key);
        if (set) {
            yield* set;
        }
    }
    clear() {
        for (const set of this.#map.values()) {
            set.clear();
        }
        this.#map.clear();
        return this;
    }
}

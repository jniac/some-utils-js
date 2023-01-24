import { Register } from '.';
export class DoubleMap {
    #map = new Map();
    set(key1, key2, value) {
        const create = () => {
            const map = new Map();
            this.#map.set(key1, map);
            return map;
        };
        const map = this.#map.get(key1) ?? create();
        map.set(key2, value);
    }
    delete(key1, key2, value) {
        const map = this.#map.get(key1);
        if (map) {
            return map.delete(key2);
        }
        return false;
    }
    get(key1, key2) {
        const map = this.#map.get(key1);
        if (map) {
            return map.get(key2);
        }
    }
}
export class DoubleRegister {
    #map = new Map();
    add(key1, key2, value) {
        const create = () => {
            const register = new Register();
            this.#map.set(key1, register);
            return register;
        };
        const register = this.#map.get(key1) ?? create();
        register.add(key2, value);
    }
    /** @obsolete Alias for `delete(k1, k2, v)`. */
    remove(key1, key2, value) { return this.delete(key1, key2, value); }
    delete(key1, key2, value) {
        const register = this.#map.get(key1);
        if (register) {
            const size = register.remove(key2, value);
            if (size === 0) {
                this.#map.delete(key1);
            }
            return size;
        }
        return -1;
    }
    get(key1, key2) {
        const register = this.#map.get(key1);
        if (register) {
            return register.get(key2);
        }
    }
}

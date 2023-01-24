export class LazyRecord {
    #map = new Map();
    #initializer;
    constructor(initializer) {
        this.#initializer = initializer;
    }
    get(key) {
        if (this.#map.has(key)) {
            return this.#map.get(key);
        }
        const value = this.#initializer(key);
        this.#map.set(key, value);
        return value;
    }
    clear() {
        this.#map.clear();
    }
}

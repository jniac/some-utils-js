export declare class LazyRecord<K, V> {
    #private;
    constructor(initializer: (key: K) => V);
    get(key: K): V;
    clear(): void;
}

export declare class DoubleMap<K1, K2, V> {
    #private;
    set(key1: K1, key2: K2, value: V): void;
    delete(key1: K1, key2: K2, value: V): boolean;
    get(key1: K1, key2: K2): V | undefined;
}
export declare class DoubleRegister<K1, K2, V> {
    #private;
    add(key1: K1, key2: K2, value: V): void;
    /** @obsolete Alias for `delete(k1, k2, v)`. */
    remove(key1: K1, key2: K2, value: V): number;
    delete(key1: K1, key2: K2, value: V): number;
    get(key1: K1, key2: K2): Set<V> | undefined;
}

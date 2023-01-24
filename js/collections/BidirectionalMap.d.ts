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
export declare class BidirectionalMap<K, V> {
    #private;
    set(key: K, value: V): void;
    getValue(key: K): V | undefined;
    getKey(value: V): K | undefined;
    clear(): void;
    get keyCount(): number;
    get valueCount(): number;
}

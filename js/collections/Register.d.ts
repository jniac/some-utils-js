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
export declare class Register<K, V> {
    #private;
    get keyCount(): number;
    add(key: K, value: V): void;
    /** @obsolete Alias for `delete(k, v)`.  */
    remove(key: K, value: V): number;
    /** Delete an entry. */
    delete(key: K, value: V): number;
    /** @obsolete Alias for `deleteAll(k)`.  */
    removeAll(key: K): boolean;
    /** Delete all entries of the given key. */
    deleteAll(key: K): boolean;
    get(key: K): Set<V> | undefined;
    keys(): IterableIterator<K>;
    entries(): Generator<(K | V)[], void, unknown>;
    values(): Generator<V, void, undefined>;
    valuesOf(key: K): Generator<V, void, undefined>;
    clear(): this;
}

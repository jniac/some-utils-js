/**
 * A set, divided into sets that are ordered by an index.
 *
 * Usage:
 * ```
 * const callbacks = new OrderSet<() => void>()
 *
 * callbacks.add(0, () => console.log('zero'))
 * callbacks.add(10, () => console.log('ten'))
 * callbacks.add(-10, () => console.log('minus ten'))
 * callbacks.add(0, () => console.log('zero (dup)'))
 *
 * for (const cb of callbacks.values()) {
 *   cb()
 * }
 * // "minus ten"
 * // "zero"
 * // "zero (dup)"
 * // "ten"
 * ```
 */
export declare class OrderSet<T> {
    #private;
    add(order: number, value: T): void;
    delete(order: number, value: T): boolean;
    clear(): void;
    values({ reverseOrder }?: {
        reverseOrder?: boolean | undefined;
    }): Generator<T, void, unknown>;
    get size(): number;
}

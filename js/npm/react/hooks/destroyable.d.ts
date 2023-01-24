export type Destroyable = null | (() => void) | {
    destroy: () => void;
} | Iterable<Destroyable>;
export declare const solveDestroyableIntoArray: (value: Destroyable, array?: (() => void)[]) => (() => void)[];
/**
 * Returns an array of callbacks `(() => void)[]` extracted from the given
 * destroyable. Since destroyables can be a lot of things (from null to iterables)
 * this method is helpful to collect the nested callbacks.
 */
export declare const collectDestroys: <T = any>(iterableOrIterator: Generator<Destroyable> | Iterable<Destroyable>, array?: (() => void)[], withValue?: ((value: T) => void) | undefined) => (() => void)[];
/**
 * Destroyable collector.
 *
 * Usage:
 * ```
 * const MyComponent = () => {
 *   const { destroy } = useMemo(() => {
 *     const destroyable = new DestroyableCollector()
 *     destroyable.into = () => console.log(`I'm dead!`)
 *     return destroyable
 *   }, [])
 *   useEffect(() => {
 *     return destroy
 *   })
 *   return (
 *     <></>
 *   )
 * }
 * ```
 */
export declare class DestroyableCollector {
    #private;
    /**
     * This is tricky. This is a pure setter that will, under the hood, push the
     * given value. Why this weird design?
     *
     * To allow concise declaration:
     * ```
     * destroyable.into = () => {
     *   // Here,
     *   // a very long function
     *   // that we don't need
     *   // to wrap into parens anymore.
     * }
     * ```
     * If you don't like it, you can still use the following:
     * ```
     * destroyable.push(() => {
     *   // Here,
     *   // a very long function
     *   // that we prefer to wrap
     *   // into parens.
     * })
     * ```
     */
    set into(value: Destroyable);
    push(value: Destroyable): void;
    destroy: () => void;
}

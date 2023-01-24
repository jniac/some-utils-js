export const solveDestroyableIntoArray = (value, array = []) => {
    if (value) {
        switch (typeof value) {
            case 'function': {
                array.push(value);
                break;
            }
            case 'object': {
                if ('destroy' in value) {
                    array.push(value.destroy);
                }
                else if (Symbol.iterator in value) {
                    const iterator = value[Symbol.iterator]();
                    for (const value of iterator) {
                        solveDestroyableIntoArray(value, array);
                    }
                }
                break;
            }
        }
    }
    return array;
};
/**
 * Returns an array of callbacks `(() => void)[]` extracted from the given
 * destroyable. Since destroyables can be a lot of things (from null to iterables)
 * this method is helpful to collect the nested callbacks.
 */
export const collectDestroys = (iterableOrIterator, array = [], withValue) => {
    const iterator = Symbol.iterator in iterableOrIterator
        ? iterableOrIterator[Symbol.iterator]()
        : iterableOrIterator;
    let item = iterator.next();
    while (item.done === false) {
        const { value } = item;
        withValue?.(value);
        solveDestroyableIntoArray(value, array);
        item = iterator.next();
    }
    return array;
};
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
export class DestroyableCollector {
    #destroyables = [];
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
    set into(value) {
        this.push(value);
    }
    push(value) {
        this.#destroyables.push(value);
    }
    destroy = () => {
        for (const callback of collectDestroys(this.#destroyables)) {
            callback();
        }
    };
}

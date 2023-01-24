let count = 0;
/**
 * Little wrapper to take ownership of an observable.
 *
 * Usage:
 * ```js
 * const myVar = own(new Observable(0))
 * // then:
 * myVar.setValue(1) // ok
 * myVar.observable.setValue(2) // error
 * ```
 */
export const own = (observable) => {
    const id = count++;
    const identity = Symbol(id);
    observable.own(identity);
    const setValue = (value, { ignoreCallbacks = false, } = {}) => {
        return observable.setValue(value, {
            ignoreCallbacks,
            owner: identity,
        });
    };
    // NOTE: a Proxy could be handy here
    return {
        observable,
        setValue,
    };
};

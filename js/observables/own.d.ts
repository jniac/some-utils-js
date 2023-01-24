import { Observable } from './Observable';
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
export declare const own: <T>(observable: Observable<T>) => {
    observable: Observable<T>;
    setValue: (value: T | ((v: T) => T), { ignoreCallbacks, }?: {
        ignoreCallbacks?: boolean | undefined;
    }) => boolean;
};

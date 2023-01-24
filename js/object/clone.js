import { isObject, isPlainObjectOrArray } from './isObject.js';
/**
 * NOTE: The source may have less keys than the destination, the result still may
 * be true. This is the meaning of "Partial". Eg:
 * ```js
 * deepPartialEquals({ foo: 1 }, { foo: 1, bar: 2 }) // true
 * ```
 * So, the order is important here, and keep in mind that this could be true:
 * ```js
 * deepPartialEquals(x, y) !== deepPartialEquals(y, x)
 * ```
 */
export const deepPartialEquals = (source, destination) => {
    if (isObject(source)) {
        if (isObject(destination) === false) {
            // source exists, but not destination!
            return false;
        }
        if (source === destination) {
            // same reference, no need to loop over properties
            return true;
        }
        // not the same reference, but may be the same properties values
        for (const key in source) {
            if (deepPartialEquals(source[key], destination[key]) === false) {
                return false;
            }
        }
        return true;
    }
    return source === destination;
};
/**
 * `deepPartialCopy` assumes that source and destination have the same structure.
 * "Writable" properties of array & "plain" object are copied ONLY. Objects withs
 * constructor are copied via reference (allowing to copy "native" properties as
 * HTMLElement, Event etc.):
 * ```js
 * // 'foo.x' is copied (and not 'foo'), but 'target' is copied as is.
 * deepPartialCopy({
 *   foo: { x: 1 },
 *   target: document.body,
 * }, dest)
 * ```
 *
 * `deepPartialCopy` will silently skip over undefined value
 */
export const deepPartialCopy = (source, destination) => {
    let hasChanged = false;
    for (const key of Object.keys(source)) {
        const value = source[key];
        if (isPlainObjectOrArray(value)) {
            if (destination && deepPartialCopy(value, destination[key])) {
                hasChanged = true;
            }
        }
        else {
            if (destination && Object.getOwnPropertyDescriptor(destination, key)?.writable === true) {
                destination[key] = value;
                hasChanged = true;
            }
        }
    }
    return hasChanged;
};
export const deepClone = (source) => {
    if (isObject(source)) {
        try {
            // @ts-ignore
            const ctor = source.constructor;
            const clone = new ctor();
            for (const key in source) {
                const value = source[key];
                clone[key] = deepClone(value);
            }
            return clone;
        }
        catch (e) {
            // if object is not clonable return it
            if (/Illegal constructor/i.test(e.message)) {
                console.warn('Could not be cloned:', source);
                return source;
            }
            // otherwise let raise an error
            throw e;
        }
    }
    return source;
};
export const deepGet = (source, path) => {
    const keys = Array.isArray(path) ? path : path.split('.');
    let scope = source;
    for (let i = 0, max = keys.length; i < max; i++) {
        if (isObject(scope) === false) {
            return undefined;
        }
        const key = keys[i];
        if (key in scope) {
            scope = scope[key];
        }
        else {
            return undefined;
        }
    }
    return scope;
};

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
export declare const deepPartialEquals: (source: any, destination: any) => boolean;
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
export declare const deepPartialCopy: (source: any, destination: any) => boolean;
export declare const deepClone: <T extends unknown>(source: T) => any;
export declare const deepGet: (source: any, path: string | (string | symbol | number)[]) => any;

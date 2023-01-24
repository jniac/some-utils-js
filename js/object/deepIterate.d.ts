type DeepIterateOptions = Partial<{
    /**
     * What should be considered as an object (dictionary)?
     * By default, any values that are not `null`, have `"object"` as type and `Object` as constructor.
     * ```js
     * value => !!value && typeof value === 'object' && value.constructor === Object
     * ```
     */
    isObjectPredicate: (target: any) => boolean;
    /**
     * What is the current path?
     * Empty string "" by default.
     * The value is used in inner recursive calls.
     */
    currentPath: string;
    /**
     * Which separator to represent the path to the nested value?
     * "." by default.
     * */
    separator: string;
}>;
type DeepEntry = {
    path: string;
    value: any;
};
/**
 * Deep iterate over any "value" properties. What is "value" property?
 * Anything that is not an "object" property (a delegate may be provided through options).
 *
 * NOTE: deep path are represented via a string, and not an array of keys.
 */
export declare const deepEntries: (target: any, options?: DeepIterateOptions) => Generator<DeepEntry, void, void>;
export declare const flatObject: (target: any, options?: DeepIterateOptions) => Record<string, any>;
export {};

export declare const mapRecord: <V1, V2, K extends string>(source: Record<K, V1>, map: (value: V1, key: string) => V2) => Record<K, V2>;
type DeepMapValuesMap = (value: any, key: string, path: string) => any;
type DeepMapValuesMapper = {
    string?: DeepMapValuesMap;
    number?: DeepMapValuesMap;
};
type DeepMapValuesOptions = Partial<{
    /** should */
    clone: boolean;
    path: string;
}>;
/**
 * Map the value of an object. Be aware: The object IS NOT cloned unless options.clone === true!
 * @param target The object to clone.
 * @param map The map delegate, or object mapper "delegate".
 * @param options Some options, as "clone".
 * @param options.clone Should the target be (deep) cloned?.
 * @returns The object mapped.
 */
export declare const deepMapValues: <T = any>(target: T, map: DeepMapValuesMap | DeepMapValuesMapper, { clone, path, }?: DeepMapValuesOptions) => T;
export {};

/**
 * Create a store that can store up to 2^32 booleans by storing the values into big int.
 */
export declare const createBooleanStore: (count?: number) => {
    get: (index: number) => boolean;
    set: (index: number, value: boolean) => void;
};

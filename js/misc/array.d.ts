/**
 * "Unflats" the given array: from one flattened array, it returns an array of
 * array of the given length.
 */
export declare const divideArray: <T>(array: T[], size: number) => T[][];
export { divideArray as unflat };

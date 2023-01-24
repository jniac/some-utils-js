type ShuffeOptions = Partial<{
    /** Should the array be duplicated? Default is false. */
    duplicate: boolean;
}>;
export declare class PRNG {
    #private;
    static seedMax: number;
    static seedDefault: number;
    static get seed(): number;
    constructor(seed?: number);
    static resetByInt(seed?: number): typeof PRNG;
    resetByInt(seed?: number): this;
    static resetByFloat(seed?: number): typeof PRNG;
    resetByFloat(seed?: number): this;
    static resetByString(str: string): typeof PRNG;
    resetByString(str: string): this;
    /**
     * @deprecated resetByString() should be preferred.
     */
    static stringReset(str: string): typeof PRNG;
    /**
     * @deprecated resetByString() should be preferred.
     */
    stringReset(str: string): this;
    static randomReset(): typeof PRNG;
    randomReset(): this;
    /**
     * Resets the current seed according to the provided argument. Internally this
     * will call "resetByInt", "resetByFloat" or "resetByString" depending on the
     * argument.
     */
    static reset(seed?: number | string): typeof PRNG | undefined;
    /**
     * Resets the current seed according to the provided argument. Internally this
     * will call "resetByInt", "resetByFloat" or "resetByString" depending on the
     * argument.
     */
    reset(seed?: number | string): this | undefined;
    static float(): number;
    float(): number;
    static range(min?: number, max?: number, { power }?: {
        power?: number | undefined;
    }): number;
    range(min?: number, max?: number, { power }?: {
        power?: number | undefined;
    }): number;
    /**
     * Returns a integer between min (inclusive) & max (exclusive)
     */
    static integer(min?: number, max?: number): number;
    /**
     * Returns a integer between min (inclusive) & max (exclusive)
     */
    integer(min?: number, max?: number): number;
    static chance(p?: number): boolean;
    chance(p?: number): boolean;
    static around({ from, deviation, power }?: {
        from?: number | undefined;
        deviation?: number | undefined;
        power?: number | undefined;
    }): number;
    around({ from, deviation, power }?: {
        from?: number | undefined;
        deviation?: number | undefined;
        power?: number | undefined;
    }): number;
    /**
     * Shuffles the array.
     *
     * Note: By default, the given array is modified. Use the "duplicate" option
     * to keep the array untouched.
     */
    static shuffle<T = any>(array: T[], { duplicate }?: ShuffeOptions): T[];
    /**
     * Shuffles the array.
     *
     * Note: By default, the given array is modified. Use the "duplicate" option
     * to keep the array untouched.
     */
    shuffle<T = any>(array: T[], { duplicate }?: ShuffeOptions): T[];
    static item<T>(items: ArrayLike<T>): T;
    item<T>(items: ArrayLike<T>): T;
    /**
     * Returns an random item according to its weight.
     *
     * The "weight" information is retrieved via a delegate.
     *
     * By default the delegate will extract any existing "weight" property or use "1":
     * ```
     * (obj: any) => obj.weight ?? 1
     * ```
     */
    static itemWithWeight<T>(items: ArrayLike<T>, weightDelegate?: (item: T) => number): T;
    /**
     * Generates a hash (string) of the specified length, using the specified alphabet.
     */
    static hash(length?: number, alphabet?: string): string;
    /**
     * Generates a hash (string) of the specified length, using the specified alphabet.
     */
    hash(length?: number, alphabet?: string): string;
    static encode(array: string, option?: {
        seed: number;
    }): string;
    static encode<T = any>(array: T[], option?: {
        seed: number;
    }): T[];
    static decode(array: string, option?: {
        seed: number;
    }): string;
    static decode<T = any>(array: T[], option?: {
        seed: number;
    }): T[];
}
export {};

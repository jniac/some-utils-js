type RangeOptions = Partial<{
    reverse: boolean;
    step: number;
}>;
export declare function range(max: number, options?: RangeOptions): Generator<number>;
export declare function range(min: number, max: number, options?: RangeOptions): Generator<number>;
export declare function aRange(max: number, options?: RangeOptions): number[];
export declare function aRange(min: number, max: number, options?: RangeOptions): number[];
export {};

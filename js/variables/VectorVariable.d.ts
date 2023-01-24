import { Variable } from './types';
type FloatArray = Float32Array | Float64Array;
export declare class VectorVariable implements Variable<ArrayLike<number>> {
    #private;
    get vectorSize(): number;
    get size(): number;
    get floatSize(): 32 | 64;
    get value(): Float32Array | Float64Array;
    get newValue(): ArrayLike<number>;
    set newValue(value: ArrayLike<number>);
    get currentValue(): ArrayLike<number>;
    set currentValue(value: ArrayLike<number>);
    get sum(): FloatArray;
    get average(): Float32Array | Float64Array;
    get derivative(): VectorVariable | null;
    get derivativeCount(): number;
    get array(): FloatArray;
    constructor(initialValue: ArrayLike<number>, { size, floatSize, derivativeCount, }?: {
        size?: number | undefined;
        floatSize?: 32 | 64 | undefined;
        derivativeCount?: number | undefined;
    });
    getValue(reverseIndex?: number, vector?: Float32Array | Float64Array): Float32Array | Float64Array;
    getAverage(): Float32Array | Float64Array;
    values(): Generator<Float32Array | Float64Array, void, unknown>;
    fill(value: ArrayLike<number>): this;
    setValue(value: ArrayLike<number>, asNewValue: boolean): this;
    setCurrentValue(value: ArrayLike<number>): this;
    setNewValue(value: ArrayLike<number>): this;
    toString({ precision, floatMaxCount }?: {
        precision?: number | undefined;
        floatMaxCount?: number | undefined;
    }): string;
}
export {};

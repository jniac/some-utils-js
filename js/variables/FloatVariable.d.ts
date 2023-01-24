import { toSvgString } from './FloatVariable-svg';
import { Variable } from './types';
export declare class FloatVariable implements Variable<number> {
    #private;
    constructor(initialValue: number, { size, floatSize, derivativeCount, }?: {
        size?: number | undefined;
        floatSize?: 32 | 64 | undefined;
        derivativeCount?: number | undefined;
    });
    getMin(): number;
    getMax(): number;
    values(): Generator<number, void, unknown>;
    /**
     * Returns an array in the "right" order.
     */
    getArray(out?: Float32Array | Float64Array | null): Float32Array | Float64Array;
    fill(value: number): this;
    setValue(value: number, asNewValue: boolean): this;
    setCurrentValue(value: number): this;
    setNewValue(value: number): this;
    toString({ precision, floatMaxCount }?: {
        precision?: number | undefined;
        floatMaxCount?: number | undefined;
    }): string;
    toSvgString(param?: Parameters<typeof toSvgString>[1]): string;
    toSvgDocumentString(): string;
    toSvgElement(): SVGSVGElement;
    openSvgDocument(): Window;
    get min(): number;
    get max(): number;
    get size(): number;
    get floatSize(): 32 | 64;
    get value(): number;
    get newValue(): number;
    set newValue(value: number);
    get currentValue(): number;
    set currentValue(value: number);
    get sum(): number;
    get average(): number;
    get derivative(): FloatVariable | null;
    get derivativeCount(): number;
    get array(): Float32Array | Float64Array;
}

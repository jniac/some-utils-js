export interface IInterval {
    min: number;
    max: number;
}
export type IntervalParams = Partial<IInterval> | {
    center: number;
    length: number;
} | [number, number];
export type IntervalDegenerateMode = 'collapse' | 'swap';
type SafeSetOptions = {
    mode?: IntervalDegenerateMode;
};
export declare class Interval {
    static ensure(params: IntervalParams): Interval;
    min: number;
    max: number;
    get length(): number;
    get center(): number;
    constructor();
    constructor(min: number, max: number, options?: SafeSetOptions);
    constructor(params: IntervalParams);
    set(min: number, max: number, options?: SafeSetOptions): Interval;
    set(params: IntervalParams): Interval;
    equals(other: Interval): boolean;
    equivalent(other: IntervalParams): boolean;
    isDegenerate(): boolean;
    contains(other: IntervalParams): boolean;
    containsValue(value: number): boolean;
    union(other: IntervalParams, receiver?: Interval): Interval;
    intersection(other: IntervalParams, receiver?: Interval): Interval;
    signedDistanceToValue(value: number): number;
    signedDistance(other: IntervalParams): number;
    signedGreatestDistance(other: IntervalParams): number;
    coverLength(other: IntervalParams): number;
    coverRatio(other: IntervalParams): number;
}
export {};

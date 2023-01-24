export interface IPoint {
    x: number;
    y: number;
}
export type PointParams = Partial<IPoint> | [number, number] | number[];
export declare class Point {
    static get dummy(): Point;
    static ensure: (p: PointParams) => Point;
    static ensureIPoint: (p: PointParams) => IPoint;
    static add(lhs: PointParams, rhs: PointParams, receiver?: Point): Point;
    static subtract(lhs: PointParams, rhs: PointParams, receiver?: Point): Point;
    static distance(p0: PointParams, p1: PointParams): number;
    static sqDistance(p0: PointParams, p1: PointParams): number;
    static clamp(p: PointParams, min: PointParams, max: PointParams, receiver?: Point): Point;
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): Point;
    set(params: PointParams): Point;
    equals(other: Point): boolean;
    equivalent(other: PointParams): boolean;
    copy(other: IPoint): this;
    clone(): Point;
    add(other: PointParams, receiver?: Point): Point;
    subtract(other: PointParams, receiver?: Point): Point;
    multiplyScalar(scalar: number, receiver?: Point): Point;
    clamp(min: PointParams, max: PointParams, receiver?: Point): Point;
    get magnitude(): number;
    get sqMagnitude(): number;
    get angle(): number;
}

import { IPoint, Point, PointParams } from './Point';
export interface ICircle {
    x: number;
    y: number;
    r: number;
}
export type CircleParams = Partial<ICircle> | [number, number, number] | number;
export declare const isCircleParams: (params: any) => boolean;
export declare class Circle {
    static ensure: (x: CircleParams) => Circle;
    static ensureICircle: (c: CircleParams) => ICircle;
    static isCircleParams: (params: any) => boolean;
    static unitCircleCircleIntersection: (radius: number, distance: number) => {
        u: number;
        v: number;
    } | null;
    static unitCircleTangentX: (distance: number) => {
        u: number;
        v: number;
    } | null;
    static unitCircleTangentPoint: (point: IPoint) => Point[];
    static circleCircleIntersects: (circle1: CircleParams, circle2: CircleParams) => boolean;
    static circleCircleStatus: (circle1: CircleParams, circle2: CircleParams) => "APART" | "CIRCLE1_CONTAINS_CIRCLE2" | "CIRCLE2_CONTAINS_CIRCLE1" | "TOUCHING";
    static circleCircleIntersection: (circle1: CircleParams, circle2: CircleParams) => Point[];
    static circleTangentPoint: (circle: CircleParams, point: PointParams) => Point[];
    x: number;
    y: number;
    r: number;
    constructor(x: number, y: number, r: number);
    constructor(params: CircleParams);
    constructor();
    set(x: number, y: number, r: number): Circle;
    set(params: CircleParams): Circle;
    containsPoint(p: PointParams): boolean;
    localPoint(p: PointParams): Point;
    globalPoint(p: PointParams): Point;
    localCircle(circle: CircleParams, receiver?: Circle): Circle;
    circleIntersects(circle: CircleParams): boolean;
    circleIntersection(circle: CircleParams): Point[];
    tangentPoint(point: PointParams): Point[];
    /**
     * Returns the tangent point angles as simple points: Point(cos, sin).
     * Useful for trigonometry operations on angles.
     * @param point
     * @returns
     */
    tangentAnglePoint(point: PointParams): Point[];
}

import { PointParams } from '.';
import { IPoint, Point } from './Point';
export type IRectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type RectangleParams = Partial<IRectangle> | [number, number, number, number] | [number, number] | number[] | {
    xMin?: number;
    yMin?: number;
    xMax?: number;
    yMax?: number;
};
declare enum DegenerateMode {
    Collapse = 0,
    CollapseMin = 1,
    CollapseMax = 2,
    Swap = 3,
    Degenerate = 4,
    Ignore = 5
}
declare enum IntersectionMode {
    Clamp = 0,
    Ignore = 1,
    Degenerate = 2
}
export declare class Rectangle {
    static get DegenerateMode(): typeof DegenerateMode;
    static get IntersectionMode(): typeof IntersectionMode;
    static ensure(params: RectangleParams, mode?: DegenerateMode): IRectangle;
    static get intersection(): <T extends IRectangle>(a: IRectangle, b: IRectangle, receiver: T, mode?: IntersectionMode) => T;
    static get union(): (a: IRectangle, b: IRectangle, receiver: IRectangle) => IRectangle;
    static get signedDistance(): (a: IRectangle, b: IRectangle, receiver: IPoint) => IPoint;
    static transposePoint(point: PointParams, from: RectangleParams, to: RectangleParams, receiver?: IPoint): IPoint;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor();
    constructor(x: number, y: number, width: number, height: number, mode?: DegenerateMode);
    constructor(width: number, height: number, mode?: DegenerateMode);
    constructor(params: RectangleParams, mode?: DegenerateMode);
    set(x: number, y: number, width: number, height: number, mode?: DegenerateMode): Rectangle;
    set(width: number, height: number, mode?: DegenerateMode): Rectangle;
    set(params: RectangleParams, mode?: DegenerateMode): Rectangle;
    get xMin(): number;
    set xMin(value: number);
    get yMin(): number;
    set yMin(value: number);
    get xMax(): number;
    set xMax(value: number);
    get yMax(): number;
    set yMax(value: number);
    get centerX(): number;
    get centerY(): number;
    get area(): number;
    get aspect(): number;
    equals(other: IRectangle): boolean;
    setDegenerate(): this;
    isDegenerate(): boolean;
    copy(other: IRectangle): this;
    clone(): Rectangle;
    setDimensions(x: number, y: number, width: number, height: number, { mode, }?: {
        mode?: DegenerateMode | undefined;
    }): this;
    setXMin(value: number): this;
    setXMax(value: number): this;
    setYMin(value: number): this;
    setYMax(value: number): this;
    union<T extends IRectangle = Rectangle>(other: RectangleParams, { receiver, }?: {
        receiver?: T | undefined;
    }): T;
    intersection<T extends IRectangle = Rectangle>(other: RectangleParams, { receiver, mode, }?: {
        receiver?: T | undefined;
        mode?: IntersectionMode | undefined;
    }): T;
    signedDistance<T extends IPoint = Point>(other: RectangleParams, { receiver, }?: {
        receiver?: T | undefined;
    }): T;
    signedGreatestDistance<T extends IPoint = Point>(other: RectangleParams, { receiver, }?: {
        receiver?: T | undefined;
    }): IPoint;
    topLeft<T extends IPoint = Point>({ receiver }?: {
        receiver?: T | undefined;
    }): Point | T;
    topRight<T extends IPoint = Point>({ receiver }?: {
        receiver?: T | undefined;
    }): Point | T;
    bottomLeft<T extends IPoint = Point>({ receiver }?: {
        receiver?: T | undefined;
    }): Point | T;
    bottomRight<T extends IPoint = Point>({ receiver }?: {
        receiver?: T | undefined;
    }): Point | T;
    center<T extends IPoint = Point>({ receiver }?: {
        receiver?: T | undefined;
    }): Point | T;
    relativePoint<T extends IPoint = Point>({ x, y }: IPoint, { receiver, }?: {
        receiver?: T | undefined;
    }): Point | T;
    closestPoint<T extends IPoint = Point>(point: IPoint, { receiver, }?: {
        receiver?: T | undefined;
    }): IPoint;
    contains(other: RectangleParams): boolean;
    containsPoint(point: IPoint): boolean;
    inflate(padding: number | {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }): IRectangle;
    toString(): string;
}
export {};

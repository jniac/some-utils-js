export declare const waitSeconds: (seconds?: number) => Promise<unknown>;
/**
 *
 * @param date
 * @param offset
 * @returns
 */
export declare const getLocalISOString: (date?: Date, offset?: number) => string;
export declare function radian(x: number): number;
export declare function radian(arr: [number, number]): [number, number];
export declare function radian(arr: [number, number, number]): [number, number, number];
export declare function radian(arr: number[]): number[];
export declare function degree(x: number): number;
export declare function degree(arr: [number, number]): [number, number];
export declare function degree(arr: [number, number, number]): [number, number, number];
export declare function degree(arr: number[]): number[];
export declare function waitNextFrame(): Promise<void>;
export declare function waitNextFrame<T>(value: T): Promise<T>;

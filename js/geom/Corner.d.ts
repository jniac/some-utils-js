export type CornerParams = {
    all?: number;
    top?: number;
    bottom?: number;
    right?: number;
    left?: number;
    topLeft?: number;
    topRight?: number;
    bottomRight?: number;
    bottomLeft?: number;
} | [number, number, number, number] | [number, number] | [number] | number;
export declare class Corner {
    static ensure(object: CornerParams): Corner;
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
    constructor(params?: CornerParams);
    set(params?: CornerParams): void;
    isAll(): boolean;
    get all(): number;
    toCSS({ scalar }?: {
        scalar?: number | undefined;
    }): string;
}

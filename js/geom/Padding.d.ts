export type PaddingParams = {
    all?: number;
    vertical?: number;
    horizontal?: number;
    top?: number;
    bottom?: number;
    right?: number;
    left?: number;
} | [number, number, number, number] | [number, number, number] | [number, number] | [number] | number;
export declare class Padding {
    static ensure(object: PaddingParams): Padding;
    top: number;
    right: number;
    bottom: number;
    left: number;
    constructor(params?: PaddingParams);
    set(params?: PaddingParams): void;
    isAll(): boolean;
    get horizontal(): number;
    get vertical(): number;
    get all(): number;
    get totalHorizontal(): number;
    get totalVertical(): number;
    toCSS({ scalar }?: {
        scalar?: number | undefined;
    }): string;
    toStyle(filter?: string, { scalar }?: {
        scalar?: number | undefined;
    }): {
        paddingTop: string;
        paddingRight: string;
        paddingBottom: string;
        paddingLeft: string;
    } | {
        marginTop: string;
        marginRight: string;
        marginBottom: string;
        marginLeft: string;
    };
}

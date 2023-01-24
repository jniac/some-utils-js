type FloatVariableInfo = {
    min: number;
    max: number;
    size: number;
    array: ArrayLike<number>;
};
type SvgStringParams = Partial<{
    tab: string;
    tabBaseCount: number;
    viewMargin: number;
    viewWidth: number;
    viewHeight: number;
    view: {
        margin: number;
        width: number;
        height: number;
    };
}>;
export declare const createDataGroup: (info: FloatVariableInfo, params?: SvgStringParams) => string[];
export declare const toSvgString: (info: FloatVariableInfo, params?: SvgStringParams) => string;
export declare const toSvgDocumentString: (info: FloatVariableInfo, params?: SvgStringParams) => string;
export {};

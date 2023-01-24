type WindowSize = {
    width: number;
    height: number;
    aspect: number;
};
type Options = Partial<{
    /** @obsolete @deprecated Not clear, prefer "executeOnResizeImmediately" instead. */
    executeOnResize: boolean;
    executeOnResizeImmediately: boolean;
    onResize: (size: WindowSize, sizeOld: WindowSize) => void;
}>;
export declare const getWindowSize: () => WindowSize;
export declare const handleWindow: ({ executeOnResize, executeOnResizeImmediately, onResize, }: Options) => {
    destroy: () => void;
};
export {};

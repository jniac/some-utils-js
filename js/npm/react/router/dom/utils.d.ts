export declare const onFrame: (callback: () => void, { frameCount }?: {
    frameCount?: number | undefined;
}) => {
    destroy: () => void;
};
export declare const onFrameOrResize: (callback: () => void, { frameCount }?: {
    frameCount?: number | undefined;
}) => {
    destroy: () => void;
};
export declare const getScrollingParentElement: (element: HTMLElement | null) => Element;
/**
 * Safari iOS proof utility.
 * In Safari iOS, even if the parent scrolling element is the <html> tag, the
 * value of "document.scrollingElement" remains the same whatever the size of
 * the window could be. Eg:
 *  - document.scrollingElement.clientHeight -> 664
 *  - window.innerHeight -> 745
 * Wait but why???
 */
export declare const getScrollingParentElementHeight: (element: HTMLElement | null) => number;

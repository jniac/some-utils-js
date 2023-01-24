import { Rectangle } from '../geom';
export type BoundsCallback<T extends HTMLElement = HTMLElement> = (bounds: Rectangle, element: T) => void;
export type BoundsType = 'local' | 'client' | 'offset';
interface BoundsOptions {
    boundsType?: BoundsType;
}
export declare const trackWindow: (callback: BoundsCallback) => void;
export declare const untrackWindow: (callback: BoundsCallback) => void;
export declare const track: (element: HTMLElement | Window, callback: BoundsCallback, options?: BoundsOptions) => (() => void) | {
    destroy: () => void;
};
export declare const untrack: (element: HTMLElement | Window, callback: BoundsCallback) => void;
export declare const onResizeEnd: (callback: () => void) => {
    destroy: () => void;
};
export {};

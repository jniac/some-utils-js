import React from 'react';
import { Rectangle } from '../../../geom';
import { BoundsCallback, BoundsType } from '../../../dom/bounds';
type Target<T> = 'createRef' | React.RefObject<T>;
type BoundsOptions = Partial<{
    /** Should recalculate on any render? */
    alwaysRecalculate: boolean;
    boundsType: BoundsType;
}>;
export declare function useBounds<T extends HTMLElement = HTMLElement>(callback: BoundsCallback<T>, options?: BoundsOptions): React.RefObject<T>;
export declare function useBounds<T extends HTMLElement = HTMLElement>(target: Target<T>, callback: BoundsCallback<T>, options?: BoundsOptions): React.RefObject<T>;
export declare function useWindowBounds(callback: BoundsCallback, { alwaysRecalculate, }?: {
    alwaysRecalculate?: boolean | undefined;
}): void;
export declare function useParentBounds<T extends HTMLElement = HTMLElement>(target: 'createRef' | React.RefObject<T>, callback: BoundsCallback, { parentSelector, includeSelf, alwaysRecalculate, // should recalculate on any render?
boundsType, }?: {
    parentSelector?: string | string[] | undefined;
    includeSelf?: boolean | undefined;
    alwaysRecalculate?: boolean | undefined;
    boundsType?: BoundsType | undefined;
}): any;
type AnyTarget = React.RefObject<HTMLElement> | HTMLElement | Window | string;
type ManyTarget = AnyTarget | AnyTarget[];
export declare function useAnyBounds(target: ManyTarget, callback: BoundsCallback, { alwaysRecalculate, // should recalculate on any render?
boundsType, }?: {
    alwaysRecalculate?: boolean | undefined;
    boundsType?: BoundsType | undefined;
}): void;
export declare function useIntersectionBounds(target1: ManyTarget, target2: ManyTarget, callback: (intersection: Rectangle, info: {
    element1: HTMLElement | Window;
    element2: HTMLElement | Window;
    bounds1: Rectangle;
    bounds2: Rectangle;
    areaRatio1: number;
    areaRatio2: number;
}) => void, { alwaysRecalculate, // should recalculate on any render?
boundsType, }?: {
    alwaysRecalculate?: boolean | undefined;
    boundsType?: BoundsType | undefined;
}): void;
/**
 * Will invoke the callback with the bounds of the children, on the first time
 * and as soon as a child has been resized.
 * @returns
 */
export declare function useChildrenBounds<T extends HTMLElement = HTMLElement>(target: 'createRef' | React.RefObject<T>, selector: string | string[], callback: (allBounds: Rectangle[], elements: HTMLElement[]) => void, { alwaysRecalculate, // should recalculate on any render?
boundsType, querySelectorAll, }?: {
    alwaysRecalculate?: boolean | undefined;
    boundsType?: BoundsType | undefined;
    querySelectorAll?: boolean | undefined;
}): any;
export {};

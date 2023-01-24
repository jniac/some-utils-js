import { Rectangle } from '../geom';
export declare const computeLocalBounds: (element: HTMLElement, receiver?: Rectangle) => Rectangle;
/**
 * Compute the bounds of an HTMLElement.
 *
 * This IS NOT the same thing than `element.getBoundingClientRect()`, since
 * here transformation (style.transform) is deliberately ignored.
 */
export declare const computeOffsetBounds: (element: HTMLElement, receiver?: Rectangle) => Rectangle;
/**
 * Returns true if the first argument is a parent/ancestor of the second argument.
 * Arguments may be null, undefined, string (querySelector!) or valid Node (DOM) reference.
 * Arguments are typed any for convenience with react dom event (target).
 */
export declare const isParentOf: (parent: any, child: any, { includeSelf, }?: {
    includeSelf?: boolean | undefined;
}) => boolean;
/**
 * Same as `querySelector()`, but going up the tree.
 */
export declare const parentQuerySelector: (element: any, selector: string, { includeSelf, }?: {
    includeSelf?: boolean | undefined;
}) => HTMLElement | null;
export declare function getScrolledElements(): Generator<Element, void, unknown>;
export declare const getScrolledElementsArray: () => Element[];

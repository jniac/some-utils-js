import { Rectangle } from '../geom.js';
export const computeLocalBounds = (element, receiver = new Rectangle()) => {
    return receiver.setDimensions(element.offsetLeft + element.clientLeft, element.offsetTop + element.clientTop, element.clientWidth, element.clientHeight);
};
/**
 * Compute the bounds of an HTMLElement.
 *
 * This IS NOT the same thing than `element.getBoundingClientRect()`, since
 * here transformation (style.transform) is deliberately ignored.
 */
export const computeOffsetBounds = (element, receiver = new Rectangle()) => {
    const width = element.clientWidth, height = element.clientHeight;
    if (!element) {
        return receiver.setDegenerate();
    }
    let x = 0, y = 0;
    // loop with parent
    while (element.offsetParent) {
        x += element.offsetLeft + element.clientLeft - element.offsetParent.scrollLeft;
        y += element.offsetTop + element.clientTop - element.offsetParent.scrollTop;
        element = element.offsetParent;
    }
    // one last step
    x += element.offsetLeft + element.clientLeft;
    y += element.offsetTop + element.clientTop;
    // on last step after the last step...
    x += -(document.scrollingElement?.scrollLeft ?? 0);
    y += -(document.scrollingElement?.scrollTop ?? 0);
    return receiver.setDimensions(x, y, width, height);
};
/**
 * Returns true if the first argument is a parent/ancestor of the second argument.
 * Arguments may be null, undefined, string (querySelector!) or valid Node (DOM) reference.
 * Arguments are typed any for convenience with react dom event (target).
 */
export const isParentOf = (parent, child, { includeSelf = false, } = {}) => {
    if (!parent || !child) {
        return false;
    }
    if (typeof parent === 'string') {
        parent = document.querySelector(parent);
    }
    if (typeof child === 'string') {
        child = document.querySelector(child);
    }
    if (parent instanceof Node === false || child instanceof Node === false) {
        throw new Error(`Invalid args!`);
    }
    if (includeSelf === false) {
        child = child.parentElement;
    }
    while (child) {
        if (child === parent) {
            return true;
        }
        child = child.parentElement;
    }
    return false;
};
/**
 * Same as `querySelector()`, but going up the tree.
 */
export const parentQuerySelector = (element, selector, { includeSelf = false, } = {}) => {
    if (!element) {
        return null;
    }
    if (includeSelf === false) {
        element = element.parentElement;
    }
    while (element) {
        if (element.matches(selector)) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
};
export function* getScrolledElements() {
    const queue = [document.firstElementChild];
    while (queue.length > 0) {
        const element = queue.pop();
        if (element.scrollTop > 0) {
            yield element;
        }
        queue.push(...element.children);
    }
}
export const getScrolledElementsArray = () => {
    return [...getScrolledElements()];
};

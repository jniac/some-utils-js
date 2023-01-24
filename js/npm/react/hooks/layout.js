import React from 'react';
import { Rectangle } from '../../../geom.js';
import { onResizeEnd, track, untrack } from '../../../dom/bounds.js';
import { computeOffsetBounds, computeLocalBounds } from "../../../dom/utils.js";
import { useComplexEffects } from '..';
const resolveRef = (target) => {
    if (target === 'createRef') {
        // that condition should never change during program execution, so we can perform a test here
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return React.useRef(null);
    }
    return target;
};
const resolveUseBoundsArgs = (args) => {
    const hasTarget = typeof args[0] !== 'function';
    if (hasTarget) {
        return [args[0], args[1], args[2]];
    }
    else {
        return ['createRef', args[0], args[1]];
    }
};
export function useBounds(...args) {
    const [target, callback, options] = resolveUseBoundsArgs(args);
    const { alwaysRecalculate = false, // should recalculate on any render?
    boundsType = 'offset', } = options ?? {};
    const ref = resolveRef(target);
    React.useEffect(() => {
        const element = ref.current;
        const safeCallback = (b, e) => ref.current && callback(b, e);
        if (element) {
            track(element, safeCallback, { boundsType });
            return () => {
                untrack(element, safeCallback);
            };
        }
        console.warn(`useBounds() is useless here, since the given ref is always null.`);
        // "callback" is not a reasonable dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, alwaysRecalculate ? undefined : [ref]);
    return ref;
}
export function useWindowBounds(callback, { alwaysRecalculate = false, // should recalculate on any render?
 } = {}) {
    React.useEffect(() => {
        const bounds = new Rectangle();
        const update = () => {
            bounds.set(window.innerWidth, window.innerHeight);
            callback(bounds, document.body);
        };
        update();
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('resize', update);
        };
        // "callback" is not a reasonable dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, alwaysRecalculate ? undefined : []);
}
const parentQuerySelector = (element, parentSelector, { includeSelf = false, } = {}) => {
    if (includeSelf === false) {
        element = element?.parentElement;
    }
    while (element) {
        if (element.matches(parentSelector)) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
};
/**
 * Returns the first mapped item that is not "falsy" (null or undefined)
 */
const mapFirst = (items, map) => {
    for (const item of items) {
        const value = map(item);
        if (value !== null && value !== undefined) {
            return value;
        }
    }
};
export function useParentBounds(target, callback, { parentSelector = '*', includeSelf = false, alwaysRecalculate = false, // should recalculate on any render?
boundsType = 'offset', } = {}) {
    const ref = resolveRef(target);
    React.useEffect(() => {
        const element = Array.isArray(parentSelector)
            ? mapFirst(parentSelector, str => parentQuerySelector(ref.current, str, { includeSelf }))
            : parentQuerySelector(ref.current, parentSelector, { includeSelf });
        if (element) {
            track(element, callback, { boundsType });
            return () => {
                untrack(element, callback);
            };
        }
        console.warn(`useParentBounds() is useless here, since the given ref is always null.`);
        // "callback" is not a reasonable dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, alwaysRecalculate ? undefined : [target]);
    return ref;
}
const resolveAnyTarget = (target) => (target instanceof Window ? target :
    target instanceof HTMLElement ? target :
        typeof target === 'string' ? document.querySelector(target) :
            target.current);
const resolveManyTarget = (target) => (Array.isArray(target)
    ? mapFirst(target, item => resolveAnyTarget(item)) ?? null
    : resolveAnyTarget(target));
export function useAnyBounds(target, callback, { alwaysRecalculate = false, // should recalculate on any render?
boundsType = 'offset', } = {}) {
    React.useEffect(() => {
        const element = resolveManyTarget(target);
        if (element) {
            track(element, callback, { boundsType });
            return () => {
                untrack(element, callback);
            };
        }
        // "fail" case
        console.warn(`useAnyBounds() is useless here, since the given ref is always resolved to null.`);
        // "callback" is not a reasonable dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, alwaysRecalculate ? undefined : [target]);
}
const resolveBounds = (element, receiver = new Rectangle(), boundsType = 'client') => {
    if (element instanceof Window) {
        return receiver.set(0, 0, window.innerWidth, window.innerHeight);
    }
    if (boundsType === 'client') {
        receiver.copy(element.getBoundingClientRect());
    }
    else if (boundsType === 'local') {
        computeLocalBounds(element, receiver);
    }
    else {
        computeOffsetBounds(element, receiver);
    }
    return receiver;
};
export function useIntersectionBounds(target1, target2, callback, { alwaysRecalculate = false, // should recalculate on any render?
boundsType = 'client', } = {}) {
    React.useEffect(() => {
        const element1 = resolveManyTarget(target1);
        const element2 = resolveManyTarget(target2);
        if (element1 && element2) {
            const bounds1 = new Rectangle();
            const bounds2 = new Rectangle();
            const intersection = new Rectangle();
            const intersectionOld = new Rectangle().setDegenerate();
            let id = -1;
            const loop = () => {
                id = window.requestAnimationFrame(loop);
                resolveBounds(element1, bounds1, boundsType);
                resolveBounds(element2, bounds2, boundsType);
                Rectangle.intersection(bounds1, bounds2, intersection);
                if (intersection.equals(intersectionOld) === false) {
                    const area = intersection.area;
                    const areaRatio1 = area / bounds1.area;
                    const areaRatio2 = area / bounds2.area;
                    callback(intersection, { element1, element2, bounds1, bounds2, areaRatio1, areaRatio2 });
                    intersectionOld.copy(intersection);
                }
            };
            loop();
            return () => {
                window.cancelAnimationFrame(id);
            };
        }
        // "fail" case
        console.warn(`useAnyBounds() is useless here, since at least one of the two targets resolves to null`);
        // "callback" is not a reasonable dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, alwaysRecalculate ? undefined : [target1, target2]);
}
/**
 * Will invoke the callback with the bounds of the children, on the first time
 * and as soon as a child has been resized.
 * @returns
 */
export function useChildrenBounds(target, selector, callback, { alwaysRecalculate = false, // should recalculate on any render?
boundsType = 'offset', querySelectorAll = Array.isArray(selector) ? false : true, } = {}) {
    const ref = resolveRef(target);
    useComplexEffects(function* () {
        const parent = ref.current;
        const selectorArray = Array.isArray(selector) ? selector : [selector];
        const elements = querySelectorAll === false
            ? [parent, ...selectorArray.map(str => parent.querySelector(str))]
            : [parent, ...selectorArray.map(str => [...parent.querySelectorAll(str)])].flat();
        const allBounds = elements.map(() => new Rectangle());
        let resizeCount = 0;
        const incrementResizeCount = () => resizeCount++;
        const resetResizeCount = () => resizeCount = 0;
        for (const [index, element] of elements.entries()) {
            yield track(element, bounds => {
                allBounds[index].copy(bounds);
                incrementResizeCount();
            }, { boundsType });
        }
        yield onResizeEnd(() => {
            if (resizeCount > 0) {
                resetResizeCount();
                callback(allBounds, elements);
            }
        });
    }, alwaysRecalculate ? 'always-recalculate' : [target, selector]);
    return ref;
}

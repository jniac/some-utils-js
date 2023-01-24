const isFullListener = (listener) => listener.length === 3;
const toFullListener = (listener) => {
    if (isFullListener(listener)) {
        const [mask, options, callback] = listener;
        return [mask, options, callback];
    }
    else {
        const [mask, callback] = listener;
        return [mask, {}, callback];
    }
};
const testMask = (mask, str) => {
    if (mask === '*') {
        return true;
    }
    if (mask instanceof RegExp) {
        return mask.test(str);
    }
    if (Array.isArray(mask)) {
        return mask.includes(str);
    }
    return mask === str;
};
let globalListenerCount = 0;
const downGlobalListeners = [];
const upGlobalListeners = [];
document.documentElement.addEventListener('keydown', event => {
    const { code, key } = event;
    let canceled = false;
    const capture = () => canceled = true;
    const info = { event, capture };
    const letter = code.startsWith('Key') ? `Letter${key.toUpperCase()}` : '';
    const callbacks = [];
    for (const { element, listeners } of downGlobalListeners) {
        if (element.contains(event.target) === false) {
            continue;
        }
        for (const listener of listeners) {
            const [mask, { priority = 0 }, callback] = toFullListener(listener);
            const match = (testMask(mask, code) ||
                testMask(mask, key) ||
                testMask(mask, letter));
            if (match) {
                callbacks.push({ callback, priority });
            }
        }
    }
    callbacks.sort((A, B) => B.priority - A.priority);
    for (const { callback } of callbacks) {
        callback?.(info);
        if (canceled) {
            break;
        }
    }
});
export const handleKeyboard = ({ element = document.body, onDown, onUp, }) => {
    const down = (() => {
        if (onDown) {
            const downGlobalListener = {
                id: globalListenerCount++,
                element,
                listeners: onDown
            };
            downGlobalListeners.push(downGlobalListener);
            return downGlobalListener;
        }
        return null;
    })();
    const up = (() => {
        if (onUp) {
            const upGlobalListener = {
                id: globalListenerCount++,
                element,
                listeners: onUp
            };
            upGlobalListeners.push(upGlobalListener);
            return upGlobalListener;
        }
        return null;
    })();
    const destroy = () => {
        if (down) {
            const index = downGlobalListeners.indexOf(down);
            downGlobalListeners.splice(index, 1);
        }
        if (up) {
            const index = upGlobalListeners.indexOf(up);
            upGlobalListeners.splice(index, 1);
        }
    };
    return { destroy };
};

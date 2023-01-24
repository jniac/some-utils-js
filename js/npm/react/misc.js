import { useEffect, useRef, useState } from 'react';
import { Observable } from '../../observables.js';
/**
 * Allow concise className declaration. Eg:
 *
 *      const MyComp: React.FC<{ minimized: boolean }> => ({ minimized }) => {
 *        return (
 *          <div className={safeClassName('MyComp', { minimized })} />
 *        )
 *      }
 */
export const safeClassName = (...args) => {
    return args
        .flat(Infinity)
        .filter(value => !!value)
        .map(value => {
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object') {
            return Object.entries(value).map(([k, v]) => v && k);
        }
        if (value === false) {
            return false;
        }
        console.log(`invalid item: ${value}`);
        return undefined;
    })
        .flat(Infinity)
        .filter(value => !!value)
        .join(' ');
};
export function mapWithSeparator(data, map, separator) {
    if (!data) {
        throw new Error(`invalid "data" (${data})`);
    }
    if (data.length === 0) {
        return [];
    }
    const result = [map(data[0], 0)];
    for (let index = 1; index < data.length; index++) {
        result.push(separator(`separator-${index - 1}`, index - 1));
        result.push(map(data[index], index));
    }
    return result;
}
// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
const getPointerType = () => navigator.maxTouchPoints === 0 ? 'mouse' : 'touch';
export const pointerTypeObs = new Observable(getPointerType());
let pointerTypeInitialized = false;
const initPointerType = () => {
    if (pointerTypeInitialized === false) {
        pointerTypeInitialized = true;
        const onPointer = (event) => {
            pointerTypeObs.setValue(event.pointerType);
        };
        const onResize = () => {
            pointerTypeObs.setValue(getPointerType());
        };
        document.addEventListener('pointermove', onPointer, { capture: true });
        document.addEventListener('pointerdown', onPointer, { capture: true });
        window.addEventListener('resize', onResize, { capture: true });
        onResize();
    }
};
export const usePointerType = () => {
    initPointerType();
    const [count, setCount] = useState(0);
    const updateRef = useRef(() => { });
    updateRef.current = () => setCount(count + 1);
    useEffect(() => {
        const { destroy } = pointerTypeObs.onChange(() => updateRef.current());
        return destroy;
    }, []);
    return pointerTypeObs.value;
};

import React from 'react';
import { collectDestroys } from './destroyable.js';
/**
 * @deprecated `useEffects` should be preferred over this.
 *
 * Using generator to allow multiple "on destroy" callbacks.
 *
 * Callbacks are return with "`yield`".
 *
 * Internally uses `React.useLayoutEffect` by default.
 *
 * Usage:
 *
 * ```js
 * useComplexEffects(function* () {
 *   subscribe(username)
 *   yield () => unsubscribe(username)
 *
 *   const onScroll = () => doSomethingCool(username)
 *   window.addEventListener('scroll', onScroll)
 *   yield () => window.removeEventListener('scroll', onScroll)
 * }, [username])
 * ```
 */
export function useComplexEffects(complexEffects, deps, { debug = '', useLayoutEffect = true } = {}) {
    // NOTE: For animation purpose, useLayoutEffect should be used to avoid "first frame glitches"
    const use = useLayoutEffect ? React.useLayoutEffect : React.useEffect;
    const result = React.useRef(undefined);
    use(() => {
        let mounted = true;
        const state = Object.freeze({ get mounted() { return mounted; } });
        const destroys = [() => mounted = false];
        const iterator = complexEffects(state);
        collectDestroys(iterator, destroys, value => result.current = value);
        if (debug) {
            console.log(`useComplexEffects debug ${debug}: ${destroys.length} callbacks`);
        }
        return () => {
            for (const destroy of destroys) {
                destroy();
            }
        };
    }, deps === 'always-recalculate' ? undefined : deps);
    return result;
}
/**
 * @deprecated `useEffects` should be preferred over this.
 *
 * Same as `useComplexEffects` but with a ref (short-hand).
 */
export function useRefComplexEffects(complexEffects, deps) {
    const ref = React.useRef(null);
    useComplexEffects(function* (state) {
        yield* complexEffects(ref.current, state);
    }, deps);
    return ref;
}
export function useForceUpdate({ waitNextFrame, }) {
    // NOTE: `requestAnimationFrame` & `mounted` here avoid some dependency call bug with React.
    // The kind that happens when a distant component is modifying an observable used here.
    // "setImmediate" solve the probleme because the update is delayed to the next frame.
    const [, setCount] = React.useState(0);
    const mounted = React.useRef(true);
    const [forceUpdate, forceUpdateNextFrame] = React.useMemo(() => {
        let count = 0;
        const forceUpdate = () => {
            count++;
            setCount(count);
        };
        const forceUpdateNextFrame = () => window.requestAnimationFrame(() => {
            if (mounted.current) {
                // DO NOT trigger `forceUpdate` on unmounted component
                forceUpdate();
            }
        });
        return [forceUpdate, forceUpdateNextFrame];
    }, []);
    React.useEffect(() => {
        mounted.current = true;
        // Wait!? 
        // This is absurd right?
        // "mounted.current" is already set to true right?
        // Yep, but you may ignore that <React.StrictMode> could render twice the SAME
        // component, so the "decomission" function may have been called, and mounted.current
        // could already be set to "false".
        // Really?
        // Really. 
        return () => {
            mounted.current = false;
        };
    }, []);
    return (waitNextFrame
        ? forceUpdateNextFrame
        : forceUpdate);
}
export function useObservable(observable, { useValueOld = false, extract } = {}) {
    const count = React.useRef(0);
    const [, setCount] = React.useState(0);
    const forceUpdate = React.useMemo(() => {
        return () => {
            count.current += 1;
            setTimeout(() => {
                setCount(count.current);
            }, 0);
        };
    }, []);
    React.useEffect(() => observable.onChange(forceUpdate).destroy, [forceUpdate, observable]);
    if (useValueOld) {
        const { value, valueOld } = observable;
        return { value, valueOld };
    }
    if (extract) {
        return extract(observable);
    }
    return observable.value;
}
export function useFetchText(url, initialValue = null) {
    const [data, setData] = React.useState(initialValue);
    React.useEffect(() => {
        window.fetch(url).then(async (response) => {
            try {
                setData(await response.text());
            }
            catch (e) {
                console.error(e);
            }
        }).catch(e => console.error(e));
    }, [url]);
    return data;
}
export function useFetchJson(url, initialValue = null) {
    const [data, setData] = React.useState(initialValue);
    React.useEffect(() => {
        window.fetch(url).then(async (response) => {
            try {
                setData(await response.json());
            }
            catch (e) {
                console.error(e);
            }
        }).catch(e => console.error(e));
    }, [url]);
    return data;
}
export function useAnimationFrame(callback) {
    React.useEffect(() => {
        let id = -1;
        const loop = (ms) => {
            id = window.requestAnimationFrame(loop);
            callback(ms);
        };
        id = window.requestAnimationFrame(loop);
        return () => {
            window.cancelAnimationFrame(id);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
export const usePromise = (getPromise, deps = []) => {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        let mounted = true;
        const promise = typeof getPromise === 'function' ? getPromise() : getPromise;
        promise.then(data => {
            if (mounted) {
                setData(data);
            }
        });
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return data;
};
/**
 * You know it. Sometimes you're not still there when a response arrive. So
 * useSafeState does not anything if the component is already unmounted.
 * @param initialValue The... initial value!
 * @returns
 */
export const useSafeState = (initialValue) => {
    const mounted = React.useRef(true);
    React.useEffect(() => {
        mounted.current = true; // Keep that line since <React.StrictMode/> can trigger the effect twice (within the SAME component).
        return () => { mounted.current = false; };
    }, []);
    const [value, setValue] = React.useState(initialValue);
    const safeSetValue = React.useMemo(() => {
        return (value) => {
            // Safe guard: do not call if unmounted
            if (mounted.current) {
                setValue(value);
            }
        };
    }, []);
    return [value, safeSetValue];
};

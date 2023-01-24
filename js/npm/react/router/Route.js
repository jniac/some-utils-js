import React from 'react';
import { Animation } from '../../../Animation.js';
import { Observable, ObservableBoolean, ObservableNumber } from '../../../observables.js';
import { compareString, location } from '../../../router.js';
import { useEffects, useForceUpdate } from '..';
import { RouterContext } from './Router.js';
export const RouteStateContext = React.createContext(null);
export const Route = ({ path, excludePath, hash, search, exact = false, strict = false, // should consider the last slash? otherwise `/foo/` and `/foo` are considered as a same vlaue. cf express "strict" property
transitionDuration = 0, children, debug = false, }) => {
    const { getPathname } = React.useContext(RouterContext);
    const innerState = React.useMemo(() => ({
        visibleObs: new ObservableBoolean(false),
        mountedObs: new ObservableBoolean(false),
    }), []);
    const state = React.useMemo(() => {
        const statusObs = new Observable('invisible');
        const activeObs = new ObservableBoolean(false);
        const alphaObs = new ObservableNumber(0);
        const flatAlphaObs = new ObservableNumber(0);
        return {
            transitionDuration,
            statusObs,
            activeObs,
            alphaObs,
            flatAlphaObs,
            // Exposing routeProps to any child, for debugging purpose essentially:
            routeProps: { path, excludePath, search, hash, exact, transitionDuration },
            // Backward compatibility:
            status: statusObs,
            active: activeObs,
            alpha: alphaObs,
        };
        // NOTE: be prudent with this
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const forceUpdate = useForceUpdate({ waitNextFrame: true });
    useEffects(function* () {
        const { statusObs, activeObs, alphaObs, flatAlphaObs, } = state;
        // Link the "status" and the inner "mounted" values:
        yield statusObs.onChange(value => innerState.mountedObs.setValue(value !== 'invisible'));
        yield statusObs.onChange(value => activeObs.setValue(value === 'visible' || value === 'entering'));
        if (debug) {
            statusObs.onChange(status => {
                console.log(`DEBUG: Route statusObs value: %c"${status}" %c${new Date().toJSON()}`, 'color: #98c379;', '');
            });
        }
        yield innerState.mountedObs.onChange(forceUpdate);
        yield innerState.visibleObs.onChange(value => {
            if (transitionDuration === 0) {
                if (value) {
                    statusObs.setValue('visible');
                    alphaObs.setValue(1);
                }
                else {
                    statusObs.setValue('invisible');
                    alphaObs.setValue(0);
                }
            }
            else {
                if (value) {
                    statusObs.setValue('entering');
                    Animation.tween(flatAlphaObs, transitionDuration, {
                        to: { value: 1 },
                        ease: 'linear',
                        onChange: () => alphaObs.setValue(Animation.getMemoizedEase('out3')(flatAlphaObs.value)),
                        onComplete: () => statusObs.setValue('visible'),
                    });
                }
                else {
                    statusObs.setValue('leaving');
                    Animation.tween(flatAlphaObs, transitionDuration, {
                        to: { value: 0 },
                        ease: 'linear',
                        onChange: () => alphaObs.setValue(Animation.getMemoizedEase('out3')(flatAlphaObs.value)),
                        onComplete: () => statusObs.setValue('invisible'),
                    });
                }
            }
        });
        const isVisible = () => {
            const pathname = getPathname();
            const exclude = excludePath && compareString(pathname, excludePath, exact);
            return (!exclude
                && compareString(pathname, path, exact)
                && (search === undefined || compareString(location.search.value, search))
                && (hash === undefined || compareString(location.hash.value, hash)));
        };
        yield location.href.onChange(() => {
            innerState.visibleObs.setValue(() => {
                const visible = isVisible();
                return visible;
            });
        }, { execute: true });
    }, [path, excludePath]);
    if (innerState.mountedObs.value === false) {
        return null;
    }
    return (<RouteStateContext.Provider value={{ ...state }}>
      {children}
    </RouteStateContext.Provider>);
};

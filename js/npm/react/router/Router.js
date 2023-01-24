import React from 'react';
import { getPathname, setUrl } from '../../../router.js';
let downPointerEvent = null;
window.addEventListener('pointerdown', event => downPointerEvent = event, { capture: true });
export const RouterContext = React.createContext({
    /**
     * The current base url.
     */
    baseUrl: '',
    /**
     * Can't remember the usage of this... But should be useful nuh?
     */
    pathnameTransform: null,
    /**
     * Get... the pathname.
     */
    getPathname: () => '',
    /**
     * Change the current url, according to the "base url".
     */
    go: (to) => { },
    /**
     * Kind of alias of "go()": return the binded "go" function:
     * ```
     * const myLink = link('/foo')
     * // is equivalent to
     * const myLink = () => go('/foo')
     * ```
     */
    link: (to) => () => { },
});
const cleanPathname = (value) => {
    return value.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
};
export const Router = ({ baseUrl = '', pathnameTransform = null, children, }) => {
    // Ensure baseUrl starts with "/"
    if (typeof baseUrl === 'string') {
        if (baseUrl.length > 0) {
            if (baseUrl.startsWith('/') === false) {
                baseUrl = '/' + baseUrl;
            }
        }
    }
    const routerGetPathname = () => {
        const pathname = cleanPathname(getPathname().replace(baseUrl, ''));
        return pathnameTransform ? cleanPathname(pathnameTransform(pathname)) || '/' : pathname;
    };
    const go = (to, { reload = false, newTab = downPointerEvent?.metaKey || downPointerEvent?.ctrlKey } = {}) => {
        if (baseUrl && to.startsWith('/')) {
            // "baseUrl" injection.
            to = baseUrl + to;
        }
        const url = new URL(to, window.location.href).href;
        if (reload) {
            window.open(url, '_self');
        }
        else {
            if (newTab) {
                window.open(url, '_blank');
            }
            else {
                setUrl(to);
            }
        }
    };
    const link = (to, { reload = false } = {}) => () => go(to, { reload });
    const context = {
        baseUrl,
        pathnameTransform,
        getPathname: routerGetPathname,
        go,
        link,
    };
    return (<RouterContext.Provider value={context}>
      {children}
    </RouterContext.Provider>);
};

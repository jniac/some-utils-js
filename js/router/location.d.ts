import { Observable } from '../observables';
export declare let homepage: string;
export declare const location: {
    href: Observable<string>;
    pathname: Observable<string>;
    search: Observable<string>;
    hash: Observable<string>;
    isHome: () => boolean;
};
export type Location = typeof location;
export declare const internalUpdate: (url: string) => {
    href: string;
    pathname: string;
    search: string;
    hash: string;
    hasChanged: boolean;
};
export declare const setUrl: (url: string, { replace }?: {
    replace?: boolean | undefined;
}) => void;
export declare const setLocation: ({ pathname, search, hash, replace, }: {
    pathname?: string | undefined;
    search?: string | undefined;
    hash?: string | undefined;
    replace?: boolean | undefined;
}) => void;
export declare const getPathname: () => string;
export declare const getPathnameOld: () => string;
export declare const setPathname: (pathname: string, { replace }?: {
    replace?: boolean | undefined;
}) => void;
export declare const getSearch: () => string;
export declare const setSearch: (search: string, { replace }?: {
    replace?: boolean | undefined;
}) => void;
export declare const clearSearch: ({ replace }?: {
    replace?: boolean | undefined;
}) => void;
export declare const getHash: () => string;
export declare const setHash: (hash: string, { replace }?: {
    replace?: boolean | undefined;
}) => void;
export declare const clearHash: ({ replace }?: {
    replace?: boolean | undefined;
}) => void;
/**
 * Same concept that react homepage.
 *
 * If homepage = /foo then /foo/bar is treated as /bar
 *
 * Since this will reset location state, this must be called before everything else.
 *
 * "homepage" Must start with "/"
 */
export declare const setHomepage: (value: string) => void;

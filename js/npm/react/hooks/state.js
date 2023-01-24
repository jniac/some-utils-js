import { useCallback, useState } from 'react';
export function useLocalStorageState(identifier, getIntialState) {
    if (typeof getIntialState === 'object') {
        const initialState = getIntialState;
        getIntialState = () => initialState;
    }
    const [state, setState] = useState(() => {
        const str = localStorage.getItem(identifier);
        if (str) {
            const data = JSON.parse(str);
            return { ...getIntialState(), ...data };
        }
        return getIntialState();
    });
    const setLocalStorageState = useCallback((state) => {
        const str = JSON.stringify(state);
        localStorage.setItem(identifier, str);
        setState(state);
    }, [identifier]);
    return [state, setLocalStorageState];
}
export function useSearchState(getIntialState) {
    if (typeof getIntialState === 'object') {
        const initialState = getIntialState;
        getIntialState = () => initialState;
    }
    const [state, setState] = useState(() => {
        const state = getIntialState();
        const url = new window.URL(document.location.href);
        for (const [key, value] of url.searchParams.entries()) {
            switch (typeof state[key]) {
                case 'boolean':
                    state[key] = /true/i.test(value);
                    break;
                case 'number':
                    state[key] = parseFloat(value);
                    break;
                default:
                    state[key] = value;
                    break;
            }
        }
        return state;
    });
    const setSearchState = useCallback((state) => {
        const url = new window.URL(document.location.href);
        for (const key in state) {
            url.searchParams.set(key, String(state[key]));
        }
        window.history.pushState(null, '', url.href);
        setState(state);
    }, []);
    return [state, setSearchState];
}

export declare function useLocalStorageState<T extends object>(identifier: string, getIntialState: () => T): [T, (value: T) => void];
export declare function useLocalStorageState<T extends object>(identifier: string, initialState: T): [T, (value: T) => void];
export declare function useSearchState<T extends object>(getIntialState: () => T): [T, (value: T) => void];
export declare function useSearchState<T extends object>(initialState: T): [T, (value: T) => void];

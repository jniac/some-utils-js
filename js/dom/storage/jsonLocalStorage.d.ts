declare function getItem<T>(key: string): T | null;
declare function getItem<T>(key: string, defaultValue: T): T;
declare function setItem<T = any>(key: string, value: T): void;
export declare const jsonLocalStorage: {
    getItem: typeof getItem;
    setItem: typeof setItem;
};
export {};

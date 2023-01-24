type Key = keyof HTMLElementEventMap;
type Options = Partial<{
    [key in Key]: (event: Event) => void;
} & {
    passive: boolean;
    capture: boolean;
} & {
    [key: string]: (event: Event) => void;
}>;
export declare const handleEvent: (target: HTMLElement | Window, options: Options) => {
    destroy: () => void;
};
export {};

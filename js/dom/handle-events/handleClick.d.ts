interface Options {
    onClick: () => void;
    clickDurationMax?: number;
    clickDistanceMax?: number;
}
export declare const handleClick: (element: HTMLElement, { onClick, clickDurationMax, clickDistanceMax, }: Options) => {
    destroy: () => void;
};
export {};

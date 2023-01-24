type DelayedCall = [number, () => void];
type Options = Partial<{
    interval: DelayedCall | DelayedCall[];
    timeout: DelayedCall | DelayedCall[];
}>;
export declare const handleTimer: (options: Options) => {
    destroy: () => void;
};
export {};

export declare const bitmask: {
    mask: (...indexes: number[]) => number;
    maskToString: (maskedFlags: number, chars?: string) => string;
    stateToString: (state: number) => string;
    invert: (x: number) => number;
    compare: (x: number, state: number) => boolean;
    apply: (x: number, state: number) => number;
};
export declare const createEnum: <T>(callback: (tools: (typeof bitmask)) => T) => T;

export declare const digest: {
    init: () => any;
    next: (x: number) => any;
    result: () => number;
    numbers: (numbers: number[]) => number;
    string: (str: string) => number;
    any: (...args: any[]) => number;
};

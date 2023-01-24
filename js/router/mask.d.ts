export type StringMask = string | RegExp | ((path: string) => boolean) | StringMask[];
export declare const compareString: (str: string, mask: StringMask, exact?: boolean) => boolean;

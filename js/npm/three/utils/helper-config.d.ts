import { ColorRepresentation } from 'three';
export type ColorKey = keyof typeof helperConfig.color;
export type ColorArg = ColorKey | ColorRepresentation;
export declare const helperConfig: {
    color: {
        'axis-x': string;
        'axis-y': string;
        'axis-z': string;
        'axis-yellow': string;
    };
    'axis-radius': number;
};
export declare const getColor: (colorArg: ColorArg) => any;

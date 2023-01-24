import { Color } from 'three';
export const helperConfig = {
    color: {
        'axis-x': '#f33',
        'axis-y': '#3c6',
        'axis-z': '#36f',
        'axis-yellow': '#fc3',
    },
    'axis-radius': .01,
};
export const getColor = (colorArg) => new Color(helperConfig.color[colorArg] ?? colorArg);

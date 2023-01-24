export declare const clamp01: (x: number) => number;
export declare const clamp: (x: number, min?: number, max?: number) => number;
export declare const lerp: (a: number, b: number, t: number) => number;
export declare const lerpUnclamped: (a: number, b: number, t: number) => number;
export declare const inverseLerp: (a: number, b: number, t: number) => number;
export declare const inverseLerpUnclamped: (a: number, b: number, t: number) => number;
export declare const remap: (inMin: number, inMax: number, outMin: number, outMax: number, x: number) => number;
export declare const remapUnclamped: (inMin: number, inMax: number, outMin: number, outMax: number, x: number) => number;
export declare const floor: (x: number, base?: number) => number;
export declare const ceil: (x: number, base?: number) => number;
export declare const round: (x: number, base?: number) => number;
/**
 * Return an always-positive-modulo, eg:
 * ```
 * positiveModulo(-10, 360) // -> 350
 * positiveModulo(370, 360) // -> 10 // of course
 * ```
 */
export declare const positiveModulo: (x: number, modulo: number) => number;
/**
 * Return an half-positive-half-negative-modulo, eg:
 * ```
 * middleModulo(190, 360) // -> -170
 * middleModulo(-190, 360) // -> 170
 * middleModulo(370, 360) // -> 10
 * ```
 */
export declare const middleModulo: (x: number, modulo: number) => number;
export declare const clampModulo: (x: number, min: number, max: number) => number;
/**
 * "Short" linear interpolation using modulo. Kind of weird. Authorize interpolation
 * over limit of a range (rotation, hue, etc).
 *
 * Eg (with t from 0 to 1):
 * - moduloShortLerp(350, 10, 360, t) -> [350, 352, 354, 356, 358, 0, 2, 4, 6, 8, 10]
 * - moduloShortLerp(10, 350, 360, t) -> [10, 8, 6, 4, 2, 0, 358, 356, 354, 352, 350]
 */
export declare const moduloShortLerp: (a: number, b: number, mod: number, alpha: number) => number;

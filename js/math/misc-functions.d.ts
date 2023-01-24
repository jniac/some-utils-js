/**
 * Very little wrapper around Math.sin().
 * ```
 * sin02(0)    // 0
 * sin02(.25)  // 1
 * sin02(.5)   // 0
 * sin02(.75)  // -1
 * sin02(1)    // 0
 * ```
 */
export declare const sin01: (x: number) => number;
/**
 * Very little wrapper around Math.sin().
 * ```
 * sin02(0.0) // 0
 * sin02(0.5) // 1
 * sin02(1.0) // 0
 * sin02(1.5) // -1
 * sin02(2.0) // 0
 * ```
 */
export declare const sin02: (x: number) => number;
export declare const radian: (degree: number) => number;
export declare const degree: (radian: number) => number;
export declare const signed: (fn: (x: number) => number, x: number) => number;
export declare const limitE: (x: number, max: number) => number;
/**
 * Useful but weird function.
 * Same result than https://www.desmos.com/calculator/zkjchucsqz?lang=fr
 * but with assymetrical margins.
 */
export declare const limitClamp: (x: number, { min, max, margin, minMargin, maxMargin, innerMargin, }?: Partial<{
    min: number;
    max: number;
    margin: number;
    minMargin: number;
    maxMargin: number;
    innerMargin: boolean;
}>) => number;
export declare const lateCosinus: (x: number, t?: number) => number;
export declare const seededRandomMax = 2147483647;
export declare const seededRandomDefaultSeed = 123456;
export declare const seededRandomGenerator: (seed?: number) => () => number;

/**
 * Returns the cubic interpolation.
 * https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves
 * @returns
 */
export declare const cubic: (x1: number, x2: number, x3: number, x4: number, t: number) => number;
/**
 * Returns the cubic derivative.
 * https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves
 */
export declare const cubicDerivative: (x1: number, x2: number, x3: number, x4: number, t: number) => number;
/**
 * Returns the cubic second derivative.
 * https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves
 * @returns
 */
export declare const cubicDerivativeSecond: (x1: number, x2: number, x3: number, x4: number, t: number) => number;
/**
 * Assuming x1 = 0, x4 = 1.
 */
export declare const cubic01: (x2: number, x3: number, t: number) => number;
/**
 * Assuming x1 = 0, x4 = 1.
 */
export declare const cubic01Derivative: (x2: number, x3: number, t: number) => number;
/**
 * Assuming x1 = 0, x4 = 1.
 */
export declare const cubic01DerivativeSecond: (x2: number, x3: number, t: number) => number;
/**
 * Search "t" for a given "x" on a 0-1 cubic bezier interval.
 * Implementation via Binary Search and final Linear Interpolation.
 * 6 iterations is enough to produce a smooth interpolation 1000px wide.
 *
 * Assuming x1 = 0, x4 = 1
 */
export declare const cubic01SearchT: (x2: number, x3: number, x: number, iterations?: number, precision?: number, lowerT?: number, upperT?: number, lowerX?: number, upperX?: number) => number;
/**
 * Solve "y" for a given "x" according to the hande (x1, y1) & (x2, y2)
 */
export declare const solveCubicEasing: (x1: number, y1: number, x2: number, y2: number, x: number, iterations?: number, precision?: number) => number;

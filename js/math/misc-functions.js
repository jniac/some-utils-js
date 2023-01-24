// export const distance = (x: number, y: number) => Math.sqrt(x * x + y * y)
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
export const sin01 = (x) => Math.sin(x * Math.PI * 2);
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
export const sin02 = (x) => Math.sin(x * Math.PI);
export const radian = (degree) => degree * Math.PI / 180;
export const degree = (radian) => radian / Math.PI * 180;
export const signed = (fn, x) => x < 0 ? -fn(-x) : fn(x);
// https://www.desmos.com/calculator/zq9kbt3xww?lang=fr
export const limitE = (x, max) => {
    x /= max;
    const e = Math.exp(2 * x);
    return max * (2 * e / (e + 1) - 1);
};
/**
 * Useful but weird function.
 * Same result than https://www.desmos.com/calculator/zkjchucsqz?lang=fr
 * but with assymetrical margins.
 */
export const limitClamp = (x, { min = -Infinity, max = Infinity, margin = 1, minMargin = margin, maxMargin = margin, innerMargin = false, } = {}) => {
    min = innerMargin ? min + minMargin : min;
    max = innerMargin ? max - maxMargin : max;
    if (x < min) {
        const d = min - x;
        return min - d * minMargin / (d + minMargin);
    }
    if (x > max) {
        const d = x - max;
        return max + d * maxMargin / (d + maxMargin);
    }
    return x;
};
// https://www.desmos.com/calculator/jrkunm5kdn?lang=fr
export const lateCosinus = (x, t = 0.5) => Math.cos(((1 + t) * x - t) * Math.PI / 2);
// https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js#L133-L144
export const seededRandomMax = 2147483647;
export const seededRandomDefaultSeed = 123456;
export const seededRandomGenerator = (seed = seededRandomDefaultSeed) => {
    if (seed <= 0 || seed >= seededRandomMax) {
        throw new Error(`random seed must be between 1 & ${seededRandomMax - 1}`);
    }
    return () => {
        seed = seed * 16807 % seededRandomMax;
        return (seed - 1) / (seededRandomMax - 1);
    };
};

export const isObject = (x) => x !== null && typeof x === 'object';
export const isPlainObjectOrArray = (x) => isObject(x) && (x.constructor === Object || x.constructor === Array);

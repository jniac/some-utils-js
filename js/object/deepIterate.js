const _isObjectPredicate = (value) => {
    return !!value && typeof value === 'object' && value.constructor === Object;
};
/**
 * Deep iterate over any "value" properties. What is "value" property?
 * Anything that is not an "object" property (a delegate may be provided through options).
 *
 * NOTE: deep path are represented via a string, and not an array of keys.
 */
export const deepEntries = function* (target, options = {}) {
    const { isObjectPredicate = _isObjectPredicate, currentPath = '', separator = '.', } = options;
    for (const key in target) {
        const value = target[key];
        const path = currentPath ? `${currentPath}${separator}${key}` : key;
        if (isObjectPredicate(value)) {
            yield* deepEntries(value, { isObjectPredicate, currentPath: path, separator });
        }
        else {
            yield { path, value };
        }
    }
};
export const flatObject = (target, options = {}) => {
    const result = {};
    for (const { path, value } of deepEntries(target, options)) {
        result[path] = value;
    }
    return result;
};

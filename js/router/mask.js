export const compareString = (str, mask, exact = true) => {
    if (Array.isArray(mask)) {
        return mask.some(submask => compareString(str, submask, exact));
    }
    if (typeof mask === 'function') {
        return mask(str);
    }
    if (mask instanceof RegExp) {
        return mask.test(str);
    }
    if (mask === '*' && str.length > 0) {
        return true;
    }
    return (exact
        ? str === mask
        : str.startsWith(mask));
};

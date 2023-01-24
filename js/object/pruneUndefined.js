import { isObject } from './isObject';
const _deleteUndefined = (target, deep) => {
    for (const key in target) {
        const value = target[key];
        if (value === undefined) {
            delete target[key];
        }
        if (deep && isObject(value)) {
            _deleteUndefined(value, true);
        }
    }
    return target;
};
const _cloneWithoutUndefined = (target, deep) => {
    const clone = {};
    for (const key in target) {
        const value = target[key];
        if (value !== undefined) {
            if (deep && isObject(value)) {
                clone[key] = _cloneWithoutUndefined(value, true);
            }
            else {
                clone[key] = value;
            }
        }
    }
    return clone;
};
export const pruneUndefined = (target, { clone = true, deep = true } = {}) => {
    return clone ? _cloneWithoutUndefined(target, deep) : _deleteUndefined(target, deep);
};

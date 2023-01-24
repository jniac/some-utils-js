import { deepClone } from './clone.js';
import { isObject } from './isObject.js';
export const mapRecord = (source, map) => {
    return Object.fromEntries(Object.entries(source)
        .map(([key, value]) => [key, map(value, key)]));
};
/**
 * Map the value of an object. Be aware: The object IS NOT cloned unless options.clone === true!
 * @param target The object to clone.
 * @param map The map delegate, or object mapper "delegate".
 * @param options Some options, as "clone".
 * @param options.clone Should the target be (deep) cloned?.
 * @returns The object mapped.
 */
export const deepMapValues = (target, map, { clone = false, path = '', } = {}) => {
    if (clone === true) {
        target = deepClone(target);
    }
    const toMap = (mapper) => {
        const { string, number } = mapper;
        return (value, key, path) => {
            const type = typeof value;
            if (type === 'string') {
                return string ? string(value, key, path) : value;
            }
            if (type === 'number') {
                return number ? number(value, key, path) : value;
            }
            return value;
        };
    };
    const _map = typeof map === 'function' ? map : toMap(map);
    for (const key in target) {
        const value = target[key];
        const childPath = path.length > 0 ? `${path}.${key}` : key;
        if (isObject(value)) {
            // Quite tricky:
            // - First, try to map the value
            // - Then compare, if has changed keep the new value, otherwise deep map the value
            const newValue = _map(value, key, childPath);
            const hasChanged = newValue !== value;
            target[key] = hasChanged ? newValue : deepMapValues(value, map, { clone: false, path: childPath });
        }
        else {
            target[key] = _map(value, key, childPath);
        }
    }
    return target;
};

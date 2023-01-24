import { Register } from '../collections.js';
const register = new Register();
const getTypeTest = (type) => {
    if (type === '*') {
        return () => true;
    }
    if (type instanceof RegExp) {
        return (x) => type.test(String(x));
    }
    if (typeof type === 'string') {
        return (x) => x === type;
    }
    if (Array.isArray(type)) {
        return (x) => {
            return type.some(subtype => getTypeTest(subtype)(x));
        };
    }
    throw new Error(`invalid type: ${type}`);
};
const getMatchingCallbacks = (target, type) => {
    const listeners = register.get(target);
    if (listeners) {
        const result = [];
        for (const listener of listeners) {
            if (listener.test(type)) {
                result.push(listener);
            }
        }
        result.sort((A, B) => A.priority > B.priority ? -1 : 1);
        return result.map(listener => listener.callback);
    }
    return [];
};
const __send = (target, type, props, modality) => {
    const callbacks = [
        ...getMatchingCallbacks('*', '*'),
        ...getMatchingCallbacks(target, type)
    ];
    if (callbacks) {
        const message = {
            target,
            type,
            props,
            stopPropagation: () => { },
        };
        for (const callback of callbacks) {
            callback(message);
        }
    }
    // TODO: SendModality!
    return {
        target,
        type,
        props,
    };
};
export function send(...args) {
    if (args.length === 1) {
        const message = args[0];
        return __send(message.target, message.type, message.props, message.sendModality);
    }
    else if (args.length > 1) {
        return __send(args[0], args[1], args[2], args[3]);
    }
    throw new Error('Oops.');
}
export const on = (target, type, callback, { priority = 0, } = {}) => {
    const listener = {
        type,
        priority,
        test: getTypeTest(type),
        callback,
    };
    register.add(target, listener);
    const destroy = () => {
        register.remove(target, listener);
    };
    return { destroy };
};
// RAW TEST: PRIORITY
// on('lol', '*', m => console.log(m.type, 'lol #0'))
// on('lol', 'ok', m => console.log(m.type, 'lol #100'), { priority: 100 })
// on('lol', /ok/, m => console.log(m.type, 'lol #Infinity'), { priority: Infinity })
// send('lol', 'ok')

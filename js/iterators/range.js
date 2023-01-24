export function* range(...args) {
    const optionsIndex = args.findIndex(v => typeof v === 'object');
    const { reverse = false, step = 1, } = optionsIndex !== -1 ? args.splice(optionsIndex, 1)[0] : {};
    let min = 0, max = 0;
    if (args.length === 1) {
        max = args[0];
    }
    else if (args.length === 2) {
        min = args[0];
        max = args[1];
    }
    else {
        throw new Error(`Invalid usage (Typescript is missing).`);
    }
    if (reverse === false) {
        for (let i = min; i < max; i += step) {
            yield i;
        }
    }
    else {
        for (let i = max - ((max - min) % step); i >= min; i -= step) {
            yield i;
        }
    }
}
export function aRange(...args) {
    // @ts-ignore
    return [...range(...args)];
}

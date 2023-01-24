const ensure = (x) => x instanceof Interval ? x : new Interval().set(x);
const safeSet = (interval, min, max, options) => {
    if (min <= max) {
        interval.min = min;
        interval.max = max;
    }
    else {
        const { mode = 'collapse' } = options ?? {};
        if (mode === 'swap') {
            interval.min = max;
            interval.max = min;
        }
        else {
            interval.min =
                interval.max = (min + max) / 2;
        }
    }
    return interval;
};
const equals = (a, b) => (a.min === b.min &&
    a.max === b.max);
const union = (a, b, receiver) => {
    receiver.min = Math.min(a.min, b.min);
    receiver.max = Math.max(a.max, b.max);
    return receiver;
};
const intersection = (a, b, receiver, options) => {
    const min = Math.max(a.min, b.min);
    const max = Math.min(a.max, b.max);
    return safeSet(receiver, min, max, options);
};
const signedDistanceToValue = (interval, x) => {
    return (x < interval.min ? x - interval.min :
        x > interval.max ? x - interval.max : 0);
};
const signedDistance = (a, b) => {
    return (a.max < b.min ? b.min - a.max :
        a.min > b.max ? b.max - a.min : 0);
};
const signedGreatestDistance = (a, b) => {
    const min = -signedDistanceToValue(b, a.min);
    const max = -signedDistanceToValue(b, a.max);
    return min > -max ? min : max;
};
const coverLength = (a, b) => {
    const min = Math.max(a.min, b.min);
    const max = Math.min(a.max, b.max);
    return min >= max ? 0 : max - min;
};
export class Interval {
    // Static
    static ensure(params) {
        return ensure(params);
    }
    // Instance
    min = 0;
    max = 1;
    get length() { return this.max - this.min; }
    get center() { return (this.max + this.min) / 2; }
    constructor(...args) {
        if (args.length > 0) {
            // @ts-ignore
            this.set(...args);
        }
    }
    set(...args) {
        if (args.length >= 2) {
            return safeSet(this, args[0], args[1], args[2]);
        }
        const [arg] = args;
        if (Array.isArray(arg)) {
            return safeSet(this, arg[0], arg[1]);
        }
        if (typeof arg === 'object') {
            if ('center' in arg) {
                const { center, length } = arg;
                return safeSet(this, center - length / 2, center + length / 2);
            }
            const { min = 0, max = 1, } = arg;
            return safeSet(this, min, max);
        }
        throw new Error(`invalid args: ${args}`);
    }
    equals(other) {
        return equals(this, other);
    }
    equivalent(other) {
        return equals(this, ensure(other));
    }
    isDegenerate() {
        return this.min > this.max;
    }
    contains(other) {
        const { min, max } = ensure(other);
        return this.min <= min && this.max >= max;
    }
    containsValue(value) {
        return this.min <= value && value <= this.max;
    }
    union(other, receiver = new Interval()) {
        return union(this, ensure(other), receiver);
    }
    intersection(other, receiver = new Interval()) {
        return intersection(this, ensure(other), receiver);
    }
    signedDistanceToValue(value) {
        return signedDistanceToValue(this, value);
    }
    signedDistance(other) {
        return signedDistance(this, ensure(other));
    }
    signedGreatestDistance(other) {
        return signedGreatestDistance(this, ensure(other));
    }
    coverLength(other) {
        return coverLength(this, ensure(other));
    }
    coverRatio(other) {
        return coverLength(this, ensure(other)) / this.length;
    }
}

const set = (point, x, y) => {
    point.x = x;
    point.y = y;
    return point;
};
const ensure = (p) => p instanceof Point ? p : new Point().set(p);
const ensureIPoint = (p) => (p && typeof p === 'object' && ('x' in p && 'y' in p)) ? p : new Point().set(p);
const equals = (a, b) => (a.x === b.x && a.y === b.y);
const add = (a, b, receiver) => {
    receiver.x = a.x + b.x;
    receiver.y = a.y + b.y;
    return receiver;
};
const subtract = (a, b, receiver) => {
    receiver.x = a.x - b.x;
    receiver.y = a.y - b.y;
    return receiver;
};
const multiplyScalar = (p, scalar, receiver) => {
    receiver.x = p.x * scalar;
    receiver.y = p.y * scalar;
    return receiver;
};
const sqMagnitude = (p) => {
    const { x, y } = p;
    return x * x + y * y;
};
const magnitude = (p) => Math.sqrt(sqMagnitude(p));
/**
 * If invalid min / max values, note that min has the last word.
 */
const clamp = (p, min, max, receiver) => {
    receiver.x = p.x > max.x ? max.x : p.x < min.x ? min.x : p.x;
    receiver.y = p.y > max.y ? max.y : p.y < min.y ? min.y : p.y;
    return receiver;
};
export class Point {
    static get dummy() { return dummy; }
    static ensure = ensure;
    static ensureIPoint = ensureIPoint;
    static add(lhs, rhs, receiver = new Point()) {
        return add(ensureIPoint(lhs), ensureIPoint(rhs), ensure(receiver));
    }
    static subtract(lhs, rhs, receiver = new Point()) {
        return subtract(ensureIPoint(lhs), ensureIPoint(rhs), ensure(receiver));
    }
    static distance(p0, p1) {
        return magnitude(Point.subtract(p0, p1, dummy));
    }
    static sqDistance(p0, p1) {
        return sqMagnitude(Point.subtract(p0, p1, dummy));
    }
    static clamp(p, min, max, receiver = new Point()) {
        return clamp(ensureIPoint(p), ensureIPoint(min), ensureIPoint(max), ensure(receiver));
    }
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(...args) {
        if (args.length === 2) {
            return set(this, args[0], args[1]);
        }
        if (args.length === 1) {
            const [arg] = args;
            if (Array.isArray(arg)) {
                const [x, y] = arg;
                return set(this, x, y);
            }
            else if (typeof arg === 'object') {
                const { x = 0, y = 0, } = arg;
                return set(this, x, y);
            }
        }
        throw new Error(`invalid args: ${args}`);
    }
    equals(other) {
        return equals(this, other);
    }
    equivalent(other) {
        return equals(this, ensureIPoint(other));
    }
    copy(other) {
        return set(this, other.x, other.y);
    }
    clone() {
        return new Point(this.x, this.y);
    }
    add(other, receiver = this) {
        return add(this, ensureIPoint(other), receiver);
    }
    subtract(other, receiver = this) {
        return subtract(this, ensureIPoint(other), receiver);
    }
    multiplyScalar(scalar, receiver = this) {
        return multiplyScalar(this, scalar, receiver);
    }
    clamp(min, max, receiver = this) {
        return clamp(this, ensureIPoint(min), ensureIPoint(max), receiver);
    }
    get magnitude() { return magnitude(this); }
    get sqMagnitude() { return sqMagnitude(this); }
    get angle() { return Math.atan2(this.y, this.x); }
}
const dummy = new Point();

import { Point } from './Point';
var DegenerateMode;
(function (DegenerateMode) {
    DegenerateMode[DegenerateMode["Collapse"] = 0] = "Collapse";
    DegenerateMode[DegenerateMode["CollapseMin"] = 1] = "CollapseMin";
    DegenerateMode[DegenerateMode["CollapseMax"] = 2] = "CollapseMax";
    DegenerateMode[DegenerateMode["Swap"] = 3] = "Swap";
    DegenerateMode[DegenerateMode["Degenerate"] = 4] = "Degenerate";
    DegenerateMode[DegenerateMode["Ignore"] = 5] = "Ignore";
})(DegenerateMode || (DegenerateMode = {}));
const equals = (a, b) => (a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height);
const setDegenerate = (rectangle) => {
    rectangle.x = 0;
    rectangle.y = 0;
    rectangle.width = NaN;
    rectangle.height = NaN;
    return rectangle;
};
const isDegenerate = (rectangle) => (isNaN(rectangle.width) ||
    isNaN(rectangle.height));
const copy = (a, b) => {
    a.x = b.x;
    a.y = b.y;
    a.width = b.width;
    a.height = b.height;
    return a;
};
const setDimensions = (rectangle, x, y, width, height, mode) => {
    if (width < 0) {
        if (mode === DegenerateMode.Collapse) {
            x += width / 2;
            width = 0;
        }
        else if (mode === DegenerateMode.CollapseMin) {
            x += width;
            width = 0;
        }
        else if (mode === DegenerateMode.CollapseMax) {
            width = 0;
        }
        else if (mode === DegenerateMode.Swap) {
            x += width;
            width = -width;
        }
        else if (mode === DegenerateMode.Degenerate) {
            return setDegenerate(rectangle);
        }
    }
    if (height < 0) {
        if (mode === DegenerateMode.Collapse) {
            y += height / 2;
            height = 0;
        }
        else if (mode === DegenerateMode.CollapseMin) {
            y += height;
            height = 0;
        }
        else if (mode === DegenerateMode.CollapseMax) {
            height = 0;
        }
        else if (mode === DegenerateMode.Swap) {
            y += height;
            height = -height;
        }
        else if (mode === DegenerateMode.Degenerate) {
            return setDegenerate(rectangle);
        }
    }
    rectangle.x = x;
    rectangle.y = y;
    rectangle.width = width;
    rectangle.height = height;
    return rectangle;
};
const set = (rectangle, params, mode) => {
    if (Array.isArray(params)) {
        if (params.length === 4) {
            return setDimensions(rectangle, params[0], params[1], params[2], params[3], mode);
        }
        if (params.length === 2) {
            return setDimensions(rectangle, 0, 0, params[0], params[1], mode);
        }
        throw new Error(`invalid arguments count: (${params.length}) ${params.join(', ')}`);
    }
    if ('xMin' in params || 'yMin' in params || 'xMax' in params || 'yMax' in params) {
        const { xMin = 0, yMin = 0, xMax = 1, yMax = 1, } = params;
        return setDimensions(rectangle, xMin, yMin, xMax - xMin, yMax - yMin, mode);
    }
    const { x = 0, y = 0, width = 1, height = 1, } = params;
    return setDimensions(rectangle, x, y, width, height, mode);
};
const ensure = (x, mode = DegenerateMode.Collapse) => x instanceof Rectangle ? x : set(new Rectangle(), x, mode);
const union = (a, b, receiver) => {
    const xMin = Math.min(a.x, b.x);
    const yMin = Math.min(a.y, b.y);
    const xMax = Math.max(a.x + a.width, b.x + b.width);
    const yMax = Math.max(a.y + a.height, b.y + b.height);
    receiver.x = xMin;
    receiver.width = xMax - xMin;
    receiver.y = yMin;
    receiver.height = yMax - yMin;
    return receiver;
};
var IntersectionMode;
(function (IntersectionMode) {
    IntersectionMode[IntersectionMode["Clamp"] = 0] = "Clamp";
    IntersectionMode[IntersectionMode["Ignore"] = 1] = "Ignore";
    IntersectionMode[IntersectionMode["Degenerate"] = 2] = "Degenerate";
})(IntersectionMode || (IntersectionMode = {}));
const intersection = (a, b, receiver, mode = IntersectionMode.Clamp) => {
    const axMin = a.x;
    const axMax = a.x + a.width;
    const bxMin = b.x;
    const bxMax = b.x + b.width;
    const ayMin = a.y;
    const ayMax = a.y + a.height;
    const byMin = b.y;
    const byMax = b.y + b.height;
    const xMin = Math.max(axMin, bxMin);
    const yMin = Math.max(ayMin, byMin);
    const xMax = Math.min(axMax, bxMax);
    const yMax = Math.min(ayMax, byMax);
    let x = xMin;
    let y = yMin;
    let width = xMax - xMin;
    let height = yMax - yMin;
    if (width < 0) {
        switch (mode) {
            case IntersectionMode.Clamp: {
                width = 0;
                x = axMax < bxMin ? axMax : axMin;
                break;
            }
            case IntersectionMode.Degenerate: {
                width = NaN;
                x = axMax < bxMin ? axMax : axMin;
                break;
            }
        }
    }
    if (height < 0) {
        switch (mode) {
            case IntersectionMode.Clamp: {
                height = 0;
                y = ayMax < byMin ? ayMax : ayMin;
                break;
            }
            case IntersectionMode.Degenerate: {
                height = NaN;
                y = ayMax < byMin ? ayMax : ayMin;
                break;
            }
        }
    }
    receiver.x = x;
    receiver.y = y;
    receiver.width = width;
    receiver.height = height;
    return receiver;
};
const signedDistance = (a, b, receiver) => {
    const axMin = a.x;
    const axMax = a.x + a.width;
    const bxMin = b.x;
    const bxMax = b.x + b.width;
    const ayMin = a.y;
    const ayMax = a.y + a.height;
    const byMin = b.y;
    const byMax = b.y + b.height;
    receiver.x = bxMin > axMax ? bxMin - axMax : bxMax < axMin ? bxMax - axMin : 0;
    receiver.y = byMin > ayMax ? byMin - ayMax : byMax < ayMin ? byMax - ayMin : 0;
    return receiver;
};
const signedDistanceToValue = (min, max, x) => {
    return (x < min ? x - min :
        x > max ? x - max : 0);
};
const signedGreatestDistance = (a, b, receiver) => {
    const axMin = a.x;
    const axMax = a.x + a.width;
    const bxMin = b.x;
    const bxMax = b.x + b.width;
    const ayMin = a.y;
    const ayMax = a.y + a.height;
    const byMin = b.y;
    const byMax = b.y + b.height;
    const xMin = -signedDistanceToValue(bxMin, bxMax, axMin);
    const xMax = -signedDistanceToValue(bxMin, bxMax, axMax);
    receiver.x = xMin > -xMax ? xMin : xMax;
    const yMin = -signedDistanceToValue(byMin, byMax, ayMin);
    const yMax = -signedDistanceToValue(byMin, byMax, ayMax);
    receiver.y = yMin > -yMax ? yMin : yMax;
    return receiver;
};
const closestPoint = (r, p, receiver) => {
    const xMin = r.x;
    const yMin = r.y;
    const xMax = xMin + r.width;
    const yMax = yMin + r.height;
    const { x, y } = p;
    receiver.x = x < xMin ? xMin : x > xMax ? xMax : x;
    receiver.y = y < yMin ? yMin : y > yMax ? yMax : y;
    return receiver;
};
const contains = (a, b) => {
    const axMin = a.x;
    const axMax = a.x + a.width;
    const bxMin = b.x;
    const bxMax = b.x + b.width;
    const ayMin = a.y;
    const ayMax = a.y + a.height;
    const byMin = b.y;
    const byMax = b.y + b.height;
    return (bxMin >= axMin &&
        bxMax <= axMax &&
        byMin >= ayMin &&
        byMax <= ayMax);
};
const containsPoint = (r, p) => {
    return (p.x >= r.x &&
        p.x <= r.x + r.width &&
        p.y >= r.y &&
        p.y <= r.y + r.height);
};
const inflate = (r, left, right, top, bottom) => {
    r.x += -left;
    r.y += -top;
    r.width += right + left;
    r.height += top + bottom;
    return r;
};
const transposePoint = (point, from, to, receiver) => {
    const x = (point.x - from.x) / from.width;
    const y = (point.y - from.y) / from.height;
    receiver.x = to.x + x * to.width;
    receiver.y = to.y + y * to.height;
    return receiver;
};
export class Rectangle {
    static get DegenerateMode() { return DegenerateMode; }
    static get IntersectionMode() { return IntersectionMode; }
    static ensure(params, mode = DegenerateMode.Collapse) { return ensure(params, mode); }
    static get intersection() { return intersection; }
    static get union() { return union; }
    static get signedDistance() { return signedDistance; }
    static transposePoint(point, from, to, receiver = new Point()) {
        return transposePoint(Point.ensure(point), ensure(from), ensure(to), receiver);
    }
    x = 0;
    y = 0;
    width = 1;
    height = 1;
    constructor(...args) {
        if (args.length > 0) {
            // @ts-ignore
            this.set.apply(this, args);
        }
    }
    set(...args) {
        if (args.length === 5) {
            return set(this, args.slice(0, 4), args[4]);
        }
        if (args.length === 4) {
            return set(this, args, DegenerateMode.Collapse);
        }
        if (args.length === 3) {
            return set(this, args.slice(0, 2), args[2]);
        }
        if (args.length === 2 && typeof args[0] === 'number') {
            return set(this, args, DegenerateMode.Collapse);
        }
        const [arg, mode = DegenerateMode.Collapse] = args;
        return set(this, arg, mode);
    }
    get xMin() { return this.x; }
    set xMin(value) { this.setXMin(value); }
    get yMin() { return this.y; }
    set yMin(value) { this.setYMin(value); }
    get xMax() { return this.x + this.width; }
    set xMax(value) { this.setXMax(value); }
    get yMax() { return this.y + this.height; }
    set yMax(value) { this.setYMax(value); }
    get centerX() { return this.x + this.width / 2; }
    get centerY() { return this.y + this.height / 2; }
    get area() { return this.width * this.height; }
    get aspect() { return this.width / this.height; }
    equals(other) {
        return equals(this, other);
    }
    setDegenerate() {
        return setDegenerate(this);
    }
    isDegenerate() {
        return isDegenerate(this);
    }
    copy(other) {
        return copy(this, other);
    }
    clone() {
        return new Rectangle().copy(this);
    }
    setDimensions(x, y, width, height, { mode = DegenerateMode.Collapse, } = {}) {
        return setDimensions(this, x, y, width, height, mode);
    }
    setXMin(value) {
        const delta = value - this.x;
        if (delta < this.width) {
            this.width += -delta;
        }
        else {
            this.width = 0;
        }
        this.x = value;
        return this;
    }
    setXMax(value) {
        const delta = this.xMax - value;
        if (delta < this.width) {
            this.width += -delta;
        }
        else {
            this.x = value;
            this.width = 0;
        }
        return this;
    }
    setYMin(value) {
        const delta = value - this.y;
        if (delta < this.height) {
            this.height += -delta;
        }
        else {
            this.height = 0;
        }
        this.y = value;
        return this;
    }
    setYMax(value) {
        const delta = this.yMax - value;
        if (delta < this.height) {
            this.height += -delta;
        }
        else {
            this.y = value;
            this.height = 0;
        }
        return this;
    }
    union(other, { receiver = new Rectangle(), } = {}) {
        return union(this, ensure(other), receiver);
    }
    intersection(other, { receiver = new Rectangle(), mode = IntersectionMode.Clamp, } = {}) {
        return intersection(this, ensure(other), receiver, mode);
    }
    signedDistance(other, { receiver = new Point(), } = {}) {
        return signedDistance(this, ensure(other), receiver);
    }
    signedGreatestDistance(other, { receiver = new Point(), } = {}) {
        return signedGreatestDistance(this, ensure(other), receiver);
    }
    topLeft({ receiver = new Point() } = {}) {
        receiver.x = this.x;
        receiver.y = this.y;
        return receiver;
    }
    topRight({ receiver = new Point() } = {}) {
        receiver.x = this.x + this.width;
        receiver.y = this.y;
        return receiver;
    }
    bottomLeft({ receiver = new Point() } = {}) {
        receiver.x = this.x;
        receiver.y = this.y + this.height;
        return receiver;
    }
    bottomRight({ receiver = new Point() } = {}) {
        receiver.x = this.x + this.width;
        receiver.y = this.y + this.height;
        return receiver;
    }
    center({ receiver = new Point() } = {}) {
        receiver.x = this.centerX;
        receiver.y = this.centerY;
        return receiver;
    }
    relativePoint({ x, y }, { receiver = new Point(), } = {}) {
        receiver.x = this.x + this.width * x;
        receiver.y = this.y + this.height * y;
        return receiver;
    }
    closestPoint(point, { receiver = new Point(), } = {}) {
        return closestPoint(this, point, receiver);
    }
    contains(other) {
        return contains(this, ensure(other));
    }
    containsPoint(point) {
        return containsPoint(this, point);
    }
    inflate(padding) {
        if (typeof padding === 'number') {
            return inflate(this, padding, padding, padding, padding);
        }
        else {
            const { left, right, top, bottom } = padding;
            return inflate(this, left, right, top, bottom);
        }
    }
    toString() {
        return `Rectangle{ x: ${this.x}, y: ${this.y}, width: ${this.width}, height:${this.height} }`;
    }
}

import { Point } from './Point.js';
export const isCircleParams = (params) => {
    const type = typeof params;
    if (type === 'number') {
        return true;
    }
    if (type === 'object' && params !== null) {
        if (Array.isArray(params)) {
            return params.length === 3 && params.every(x => typeof x === 'number');
        }
        if ('x' in params && typeof params.x !== 'number') {
            return false;
        }
        if ('y' in params && typeof params.x !== 'number') {
            return false;
        }
        if ('r' in params && typeof params.x !== 'number') {
            return false;
        }
        return true;
    }
    return false;
};
const ensure = (x) => x instanceof Circle ? x : new Circle(x);
const ensureICircle = (c) => (c && typeof c === 'object' && ('x' in c && 'y' in c && 'r' in c)) ? c : new Circle(c);
const set = (circle, x, y, r) => {
    circle.x = x;
    circle.y = y;
    circle.r = r;
    return circle;
};
const localPoint = (circle, point, receiver) => {
    receiver.x = (point.x - circle.x) / circle.r;
    receiver.y = (point.y - circle.y) / circle.r;
    return receiver;
};
const globalPoint = (circle, localPoint, receiver) => {
    receiver.x = circle.x + localPoint.x * circle.r;
    receiver.y = circle.y + localPoint.y * circle.r;
    return receiver;
};
const localCircle = (circle, circle2, receiver) => {
    receiver.x = (circle2.x - circle.x) / circle.r;
    receiver.y = (circle2.y - circle.y) / circle.r;
    receiver.r = circle2.r / circle.r;
    return receiver;
};
const containsPoint = (circle, point) => {
    const x = circle.x - point.x;
    const y = circle.y - point.y;
    return x * x + y * y <= circle.r * circle.r;
};
const circleCircleIntersects = (circle1, circle2) => {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const { r: r1 } = circle1;
    const { r: r2 } = circle2;
    const rr = circle1.r + circle2.r;
    const sqDistance = dx * dx + dy * dy;
    if (sqDistance > rr * rr) {
        return false;
    }
    const distance = Math.sqrt(sqDistance);
    if (distance + r2 < r1) {
        return false;
    }
    if (distance + r1 < r2) {
        return false;
    }
    return true;
};
const circleCircleStatus = (circle1, circle2) => {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const { r: r1 } = circle1;
    const { r: r2 } = circle2;
    const rr = circle1.r + circle2.r;
    const sqDistance = dx * dx + dy * dy;
    if (sqDistance > rr * rr) {
        return 'APART';
    }
    const distance = Math.sqrt(sqDistance);
    if (distance + r2 < r1) {
        return 'CIRCLE1_CONTAINS_CIRCLE2';
    }
    if (distance + r1 < r2) {
        return 'CIRCLE2_CONTAINS_CIRCLE1';
    }
    return 'TOUCHING';
};
/**
 * Returns the intersection of a circle with the Unit Circle:
 * https://www.desmos.com/calculator/wnnlatidcn
 * @param radius
 * @param distance
 * @returns
 */
const unitCircleCircleIntersection = (radius, distance) => {
    if (distance > radius + 1) {
        return null;
    }
    // Remember: 
    // xx + yy = 1
    // y = sqrt(1 - xx)
    const u = (distance * distance - radius * radius + 1) / (2 * distance);
    const v = Math.sqrt(1 - u * u);
    return { u, v };
};
/**
 * Returns the intersections (array) of two circles.
 * Result may contain 0, 1 or 2 intersection points.
 *
 * https://www.desmos.com/calculator/lqcxd2kcxj
 * @param circle1
 * @param circle2
 * @returns
 */
const circleCircleIntersection = (circle1, circle2) => {
    const { x: x1, y: y1, r: r1 } = circle1;
    const { x: x2, y: y2, r: r2 } = circle2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const rt = r1 + r2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > rt) {
        return [];
    }
    if (distance + r1 < r2) {
        return [];
    }
    if (distance + r2 < r1) {
        return [];
    }
    if (distance === rt) {
        return [
            new Point((circle1.x + circle2.x) / 2, (circle1.y + circle2.y) / 2)
        ];
    }
    // cf unitCircleCircleIntersection()
    const local_d = distance / r1;
    const local_r = r2 / r1;
    const u = (local_d * local_d - local_r * local_r + 1) / (2 * local_d);
    const v = Math.sqrt(1 - u * u);
    const cx = dx / distance * r1;
    const cy = dy / distance * r1;
    const ix = circle1.x + cx * u;
    const iy = circle1.y + cy * u;
    const vx = -cy * v;
    const vy = cx * v;
    return [
        new Point(ix + vx, iy + vy),
        new Point(ix - vx, iy - vy),
    ];
};
/**
 * Minimalist solution, which inspires the other following.
 * https://www.desmos.com/calculator/gfzf3tpana
 * @param distance
 * @returns
 */
const unitCircleTangentX = (distance) => {
    if (distance < 1) {
        return null;
    }
    const u = 1 / distance;
    const v = Math.sqrt(1 - u * u);
    return { u, v };
};
const unitCircleTangentPoint = (point) => {
    const { x, y } = point;
    const distance = Math.sqrt(x * x + y * y);
    if (distance < 1) {
        return [];
    }
    if (distance === 1) {
        return [new Point(x, y)];
    }
    const u = 1 / distance;
    const v = Math.sqrt(1 - u * u);
    const cx = x / distance;
    const cy = y / distance;
    // Colinear:
    const ux = u * cx;
    const uy = u * cy;
    // Normal:
    const vx = -v * cy;
    const vy = v * cx;
    return [
        new Point(ux + vx, uy + vy),
        new Point(ux - vx, uy - vy),
    ];
};
const circleTangentPoint = (circle, point) => {
    const dx = point.x - circle.x;
    const dy = point.y - circle.y;
    const r = circle.r;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < r) {
        return [];
    }
    if (distance === r) {
        return [new Point(point.x, point.y)];
    }
    const u = 1 / (distance / r);
    const v = Math.sqrt(1 - u * u);
    const cx = dx / distance * r;
    const cy = dy / distance * r;
    // Center + Colinear:
    const ix = circle.x + cx * u;
    const iy = circle.y + cy * u;
    // Normal:
    const vx = -cy * v;
    const vy = cx * v;
    return [
        new Point(ix + vx, iy + vy),
        new Point(ix - vx, iy - vy),
    ];
};
export class Circle {
    static ensure = ensure;
    static ensureICircle = ensureICircle;
    static isCircleParams = isCircleParams;
    static unitCircleCircleIntersection = unitCircleCircleIntersection;
    static unitCircleTangentX = unitCircleTangentX;
    static unitCircleTangentPoint = unitCircleTangentPoint;
    static circleCircleIntersects = (circle1, circle2) => circleCircleIntersects(ensureICircle(circle1), ensureICircle(circle2));
    static circleCircleStatus = (circle1, circle2) => circleCircleStatus(ensureICircle(circle1), ensureICircle(circle2));
    static circleCircleIntersection = (circle1, circle2) => circleCircleIntersection(ensureICircle(circle1), ensureICircle(circle2));
    static circleTangentPoint = (circle, point) => circleTangentPoint(ensureICircle(circle), Point.ensureIPoint(point));
    x;
    y;
    r;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.r = 1;
        // @ts-ignore
        this.set.apply(this, arguments);
    }
    set(...args) {
        if (args.length === 3) {
            return set(this, args[0], args[1], args[2]);
        }
        if (args.length === 1) {
            const params = args[0];
            if (typeof params === 'number') {
                return set(this, 0, 0, params);
            }
            if (Array.isArray(params)) {
                return set(this, params[0], params[1], params[2]);
            }
            return set(this, params.x ?? 0, params.y ?? 0, params.r ?? 1);
        }
        return this;
    }
    containsPoint(p) {
        return containsPoint(this, Point.ensureIPoint(p));
    }
    localPoint(p) {
        return localPoint(this, Point.ensureIPoint(p), new Point());
    }
    globalPoint(p) {
        return globalPoint(this, Point.ensureIPoint(p), new Point());
    }
    localCircle(circle, receiver = new Circle()) {
        return localCircle(this, ensureICircle(circle), receiver);
    }
    circleIntersects(circle) {
        return circleCircleIntersects(this, ensureICircle(circle));
    }
    circleIntersection(circle) {
        return circleCircleIntersection(this, ensureICircle(circle));
    }
    tangentPoint(point) {
        return circleTangentPoint(this, Point.ensureIPoint(point));
    }
    /**
     * Returns the tangent point angles as simple points: Point(cos, sin).
     * Useful for trigonometry operations on angles.
     * @param point
     * @returns
     */
    tangentAnglePoint(point) {
        return unitCircleTangentPoint(localPoint(this, Point.ensureIPoint(point), Point.dummy));
    }
}

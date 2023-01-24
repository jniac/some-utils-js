import { deepMapValues } from '../object';
export const waitSeconds = (seconds = 1) => new Promise(resolve => setTimeout(resolve, seconds * 1e3));
/**
 *
 * @param date
 * @param offset
 * @returns
 */
export const getLocalISOString = (date = new Date(), offset = date.getTimezoneOffset()) => {
    const offsetAbs = Math.abs(offset);
    const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString();
    const hh = String(Math.floor(offsetAbs / 60)).padStart(2, '0');
    const mm = String(offsetAbs % 60).padStart(2, '0');
    return `${isoString.slice(0, -1)}${offset > 0 ? '-' : '+'}${hh}:${mm}`;
};
export function radian(x) {
    if (typeof x === 'number') {
        return x * Math.PI / 180;
    }
    return deepMapValues(x, {
        number: x => x * Math.PI / 180,
    }, { clone: true });
}
export function degree(x) {
    if (typeof x === 'number') {
        return x * 180 / Math.PI;
    }
    return deepMapValues(x, {
        number: x => x * 180 / Math.PI,
    }, { clone: true });
}
export function waitNextFrame(value) {
    return new Promise(resolve => requestAnimationFrame(() => resolve(value)));
}

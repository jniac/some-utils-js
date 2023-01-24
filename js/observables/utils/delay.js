const map = new WeakMap();
export const setValueWithDelay = (observable, value, seconds, clearOnChange = true, clearPrevious = true) => {
    const id = window.setTimeout(() => {
        observable.setValue(value);
    }, seconds * 1000);
    if (clearOnChange) {
        // NOTE: any intermediate changes will cancel this (future) one.
        // And if not, the callback will auto-cleared when the value will change.
        const { destroy } = observable.onChange(() => {
            window.clearTimeout(id);
            destroy();
        });
    }
    if (clearPrevious) {
        window.clearTimeout(map.get(observable));
        map.set(observable, id);
    }
};

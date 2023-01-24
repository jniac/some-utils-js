const isDelayedCalls = (value) => {
    return Array.isArray(value[0]);
};
export const handleTimer = (options) => {
    const { interval, timeout, } = options;
    const intevalIds = new Set();
    const timeoutIds = new Set();
    if (interval) {
        if (isDelayedCalls(interval)) {
            for (const [delay, callback] of interval) {
                intevalIds.add(window.setInterval(callback, delay));
            }
        }
        else {
            const [delay, callback] = interval;
            intevalIds.add(window.setInterval(callback, delay));
        }
    }
    if (timeout) {
        if (isDelayedCalls(timeout)) {
            for (const [delay, callback] of timeout) {
                timeoutIds.add(window.setTimeout(callback, delay));
            }
        }
        else {
            const [delay, callback] = timeout;
            timeoutIds.add(window.setTimeout(callback, delay));
        }
    }
    const destroy = () => {
        for (const id of intevalIds) {
            window.clearInterval(id);
        }
        for (const id of timeoutIds) {
            window.clearTimeout(id);
        }
    };
    return { destroy };
};

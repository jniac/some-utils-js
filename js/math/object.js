export const deepLerpUnclamped = (from, to, out, alpha) => {
    for (const key in from) {
        const fromValue = from[key];
        switch (typeof fromValue) {
            case 'number': {
                out[key] = fromValue + (to[key] - fromValue) * alpha;
                break;
            }
            case 'object': {
                if (fromValue !== null) {
                    deepLerpUnclamped(fromValue, to[key], out[key], alpha);
                }
                break;
            }
        }
    }
};
export const deepLerp = (from, to, out, alpha) => {
    alpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
    deepLerpUnclamped(from, to, out, alpha);
};

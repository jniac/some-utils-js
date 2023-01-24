export const handleEvent = (target, options) => {
    const { capture = false, passive = true, } = options;
    for (const key in options) {
        target.addEventListener(key, options[key], { capture, passive });
    }
    const destroy = () => {
        for (const key in options) {
            target.removeEventListener(key, options[key], { capture });
        }
    };
    return { destroy };
};

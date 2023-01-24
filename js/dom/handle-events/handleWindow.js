const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: window.innerWidth / window.innerHeight,
};
const sizeOld = { ...size };
export const getWindowSize = () => size;
export const handleWindow = ({ executeOnResize = true, executeOnResizeImmediately = executeOnResize, // Depends from the deprecated variable, but no other choice here. 
onResize, }) => {
    const _onResize = () => {
        Object.assign(sizeOld, size);
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        size.aspect = window.innerWidth / window.innerHeight;
        onResize?.(size, sizeOld);
    };
    if (executeOnResizeImmediately) {
        onResize?.(size, sizeOld);
    }
    window.addEventListener('resize', _onResize);
    const destroy = () => {
        window.removeEventListener('resize', _onResize);
    };
    return { destroy };
};

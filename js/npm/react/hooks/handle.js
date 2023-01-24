import React from 'react';
import { handlePointer, getWindowSize, handleWindow } from '../../../dom/handle-events.js';
export function usePointerHandle(ref, options) {
    React.useEffect(() => {
        const { destroy } = handlePointer(ref.current, options);
        return destroy;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);
}
export const useWindowHandle = () => {
    const [size, setSize] = React.useState(getWindowSize());
    React.useEffect(() => handleWindow({
        executeOnResize: false,
        onResize: size => setSize(size),
    }).destroy);
    return size;
};

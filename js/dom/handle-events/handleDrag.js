export const handleDrag = (element, { onDrag, onDragStart, onDragEnd, distanceMin = 4, }) => {
    let dragging = false;
    const state = {
        get downX() { return state.downEvent.x; },
        get downY() { return state.downEvent.y; },
        get dragX() { return state.moveEvent.x - state.downEvent.x; },
        get dragY() { return state.moveEvent.y - state.downEvent.y; },
        get deltaX() { return state.moveEvent.x - state.moveEventOld.x; },
        get deltaY() { return state.moveEvent.y - state.moveEventOld.y; },
        downEvent: null,
        moveEvent: null,
        moveEventOld: null,
    };
    const onPointerMove = (event) => {
        if (dragging === false) {
            const x = event.x - state.downX;
            const y = event.y - state.downY;
            const d2 = x * x + y * y;
            if (d2 >= distanceMin) {
                dragging = true;
                state.moveEventOld = state.downEvent;
                state.moveEvent = event;
                onDragStart?.(state);
                onDrag?.(state);
            }
        }
        else {
            state.moveEventOld = state.moveEvent;
            state.moveEvent = event;
            onDrag?.(state);
        }
    };
    const onPointerDown = (event) => {
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        state.downEvent = event;
    };
    const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        if (dragging) {
            dragging = false;
            onDragEnd?.(state);
        }
    };
    element.addEventListener('pointerdown', onPointerDown);
    const destroy = () => {
        element.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointermove', onPointerMove);
    };
    return { destroy };
};

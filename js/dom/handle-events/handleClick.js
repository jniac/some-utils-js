export const handleClick = (element, { onClick, clickDurationMax = 0.3, clickDistanceMax = 10, }) => {
    const down = {
        timestamp: -1,
        x: 0, y: 0,
    };
    const onPointerDown = (event) => {
        window.addEventListener('pointerup', onPointerUp);
        down.timestamp = Date.now();
        down.x = event.x;
        down.y = event.y;
    };
    const onPointerUp = (event) => {
        window.removeEventListener('pointerup', onPointerUp);
        const duration = (Date.now() - down.timestamp) / 1000;
        const x = event.x - down.x;
        const y = event.y - down.y;
        const distance2 = x * x + y * y;
        if (duration <= clickDurationMax && distance2 <= clickDistanceMax * clickDistanceMax) {
            onClick();
        }
    };
    element.addEventListener('pointerdown', onPointerDown);
    const destroy = () => {
        element.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
    };
    return { destroy };
};

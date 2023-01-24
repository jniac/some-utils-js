import { Point } from '../../../geom.js';
export const isDragListening = (options) => {
    return !!(options.onDragStart
        ?? options.onDragStop
        ?? options.onDrag
        ?? options.onHorizontalDragStart
        ?? options.onHorizontalDragStop
        ?? options.onHorizontalDrag
        ?? options.onVerticalDragStart
        ?? options.onVerticalDragStop
        ?? options.onVerticalDrag);
};
const getDragInfo = (downEvent, moveEvent, movePoint, previousMovePoint, direction) => {
    return {
        delta: new Point().copy(movePoint).subtract(previousMovePoint),
        total: new Point().copy(movePoint).subtract(moveEventToPoint(downEvent)),
        moveEvent,
        downEvent,
        direction,
    };
};
const moveEventToPoint = (moveEvent) => {
    if (moveEvent instanceof PointerEvent) {
        return new Point(moveEvent.clientX, moveEvent.clientY);
    }
    else {
        return new Point(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
    }
};
const dragHasStart = (downPoint, movePoint, distanceThreshold) => {
    const { x, y } = Point.subtract(movePoint, downPoint);
    const start = (x * x) + (y * y) > distanceThreshold * distanceThreshold;
    const direction = Math.abs(x / y) > 1 ? 'horizontal' : 'vertical';
    return [start, direction];
};
export const handleDrag = (element, options) => {
    const { capture = false, passive = true, dragDistanceThreshold = 10, dragDamping = .7, } = options;
    let downEvent = null;
    let moveEvent;
    let isTouch = false;
    let touchCount = 0;
    const downPoint = new Point();
    const movePoint = new Point();
    const easeMovePoint = new Point();
    const previousMovePoint = new Point();
    let isDown = false;
    let dragStart = false;
    let dragDirection = 'horizontal';
    let onDownFrameId = -1;
    const onDirectionalDrag = () => dragDirection === 'horizontal' ? options.onHorizontalDrag : options.onVerticalDrag;
    const onDirectionalDragStart = () => dragDirection === 'horizontal' ? options.onHorizontalDragStart : options.onVerticalDragStart;
    const onDirectionalDragStop = () => dragDirection === 'horizontal' ? options.onHorizontalDragStop : options.onVerticalDragStop;
    const onPointerDown = (event) => {
        if (isDown) {
            return;
        }
        if (options.onDownIgnore?.(event)) {
            return;
        }
        isDown = true;
        isTouch = event.pointerType === 'touch';
        dragStart = false;
        downEvent = event;
        downPoint.set(event.clientX, event.clientY);
        movePoint.copy(downPoint);
        easeMovePoint.copy(downPoint);
        previousMovePoint.copy(downPoint);
        if (isTouch) {
            window.addEventListener('touchmove', onMoveDown, { capture, passive });
            window.addEventListener('touchend', onMoveDownEnd, { capture, passive });
        }
        else {
            window.addEventListener('pointermove', onMoveDown, { capture, passive });
            window.addEventListener('pointerup', onMoveDownEnd, { capture, passive });
        }
        onDownFrame();
    };
    const onMoveDown = (event) => {
        moveEvent = event;
        if (event instanceof TouchEvent) {
            const [touch] = event.touches;
            movePoint.set(touch.clientX, touch.clientY);
        }
        else {
            movePoint.set(event.clientX, event.clientY);
        }
    };
    const onDownFrame = () => {
        if (isDown) {
            onDownFrameId = window.requestAnimationFrame(onDownFrame);
            // Do not trigger "end" on multi touch if some touch still exists.
            if (moveEvent instanceof TouchEvent) {
                const previousTouchCount = touchCount;
                touchCount = moveEvent.touches.length;
                // Back from multi touch (ex: "pinch" gesture), reset the position.
                if (touchCount === 1 && previousTouchCount > 1) {
                    const [touch] = moveEvent.touches;
                    movePoint.set(touch.clientX, touch.clientY);
                    previousMovePoint.copy(movePoint);
                    easeMovePoint.copy(movePoint);
                }
                // Skip multi touch.
                if (touchCount > 1) {
                    return;
                }
            }
            if (dragStart === false) {
                [dragStart, dragDirection] = dragHasStart(downPoint, movePoint, dragDistanceThreshold);
                if (dragStart) {
                    // Drag Started!
                    const info = getDragInfo(downEvent, moveEvent, movePoint, previousMovePoint, dragDirection);
                    options.onDragStart?.(info);
                    onDirectionalDragStart()?.(info);
                }
            }
            if (dragStart) {
                previousMovePoint.copy(easeMovePoint);
                easeMovePoint.x += (movePoint.x - easeMovePoint.x) * dragDamping;
                easeMovePoint.y += (movePoint.y - easeMovePoint.y) * dragDamping;
                const info = getDragInfo(downEvent, moveEvent, easeMovePoint, previousMovePoint, dragDirection);
                options.onDrag?.(info);
                onDirectionalDrag()?.(info);
            }
        }
    };
    const onMoveDownEnd = (event) => {
        if (isTouch) {
            if (event.touches.length > 0) {
                const [touch] = moveEvent.touches;
                movePoint.set(touch.clientX, touch.clientY);
                return;
            }
            window.removeEventListener('touchmove', onMoveDown, { capture });
            window.removeEventListener('touchend', onMoveDownEnd, { capture });
        }
        else {
            window.removeEventListener('pointermove', onMoveDown, { capture });
            window.removeEventListener('pointerup', onMoveDownEnd, { capture });
        }
        window.cancelAnimationFrame(onDownFrameId);
        if (dragStart) {
            const info = getDragInfo(downEvent, moveEvent, easeMovePoint, previousMovePoint, dragDirection);
            options.onDragStop?.(info);
            onDirectionalDragStop()?.(info);
        }
        isDown = false;
        downEvent = null;
        dragStart = false;
    };
    const target = element; // Fooling typescript.
    target.addEventListener('pointerdown', onPointerDown, { capture, passive });
    const destroy = () => {
        target.removeEventListener('pointerdown', onPointerDown, { capture });
        window.removeEventListener('touchmove', onMoveDown, { capture });
        window.removeEventListener('touchend', onMoveDownEnd, { capture });
        window.removeEventListener('pointermove', onMoveDown, { capture });
        window.removeEventListener('pointerup', onMoveDownEnd, { capture });
        window.cancelAnimationFrame(onDownFrameId);
    };
    return { destroy };
};

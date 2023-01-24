import { middleModulo } from 'some-utils/math';
import { Point } from '../../../geom';
import { destroyDebugDisplay, updateDebugDisplay } from './pinch-debug';
export const isPinchListening = (options) => {
    return !!(options.onPinch
        ?? options.onPinchStart
        ?? options.onPinchStop);
};
export const handlePinch = (element, options) => {
    const { capture = false, passive = true, useFakePinch: fakePinch = true, debugPinch = false, panDamping = .66, } = options;
    const info = { frame: 0, totalRotation: 0 };
    let isPinch = false;
    let isFakePinch = false;
    let fakePinchStartPoint = null;
    let touchEvent = null;
    let points = [];
    let pointsOld = [];
    const centerEase = new Point();
    const update = (point0, point1, isFakePinch) => {
        pointsOld = points;
        info.old = info.current;
        const center = Point.add(point0, point1).multiplyScalar(.5);
        const gap = Point.subtract(point1, point0);
        const gapMagnitude = gap.magnitude;
        const totalScale = info.start ? gapMagnitude / info.start.gapMagnitude : 1;
        const frameScale = info.old ? gapMagnitude / info.old.gapMagnitude : 1;
        const frameRotation = info.old ? middleModulo(gap.angle - info.old.gap.angle, 2 * Math.PI) : 0;
        const totalRotation = (info.old ? info.old.totalRotation : 0) + frameRotation;
        if (info.start) {
            centerEase.x += (center.x - centerEase.x) * panDamping;
            centerEase.y += (center.y - centerEase.y) * panDamping;
        }
        else {
            centerEase.copy(center);
        }
        const state = {
            point0,
            point1,
            centerExact: center,
            center: centerEase.clone(),
            gap,
            gapMagnitude,
            frameScale,
            totalScale,
            frameRotation,
            totalRotation,
            isFakePinch,
        };
        info.current = state;
        if (!info.start) {
            info.start = state;
            info.old = state;
            options.onPinchStart?.(info);
        }
        options.onPinch?.(info);
        info.frame++;
    };
    const stop = () => {
        options.onPinchStop?.(info);
        info.frame = 0;
        info.current = undefined;
        info.old = undefined;
        info.start = undefined;
        fakePinchStartPoint = null;
        destroyDebugDisplay();
    };
    const onPointerDown = (event) => {
        if (fakePinch) {
            if (fakePinchStartPoint === null) {
                fakePinchStartPoint = event.altKey
                    ? new Point(window.innerWidth / 2, window.innerHeight / 2)
                    : new Point(event.clientX, event.clientY);
            }
        }
    };
    const onTouch = (event) => {
        touchEvent = event;
        points = [...event.touches].map(touch => new Point(touch.clientX, touch.clientY));
        isPinch = points.length === 2;
        isFakePinch = points.length === 1 && fakePinch && (event.shiftKey || event.altKey);
        if (points.length < 2 && info.current && info.current.isFakePinch === false) {
            stop();
        }
        if (points.length < 1 && info.current && info.current.isFakePinch) {
            stop();
        }
    };
    let frameId = -1;
    const frameUpdate = () => {
        frameId = window.requestAnimationFrame(frameUpdate);
        // Regular pinch.
        if (isPinch) {
            update(points[0], points[1], false);
            if (debugPinch) {
                updateDebugDisplay(points[0], points[1]);
            }
        }
        // Fake pinch.
        if (isFakePinch && fakePinchStartPoint !== null) {
            const [point0] = points;
            const [point0Old] = pointsOld;
            if (point0Old && touchEvent && touchEvent.shiftKey && touchEvent.altKey) {
                fakePinchStartPoint.x += point0.x - point0Old.x;
                fakePinchStartPoint.y += point0.y - point0Old.y;
            }
            const delta = point0.clone().subtract(fakePinchStartPoint);
            if (delta.sqMagnitude > 0) {
                const minimalMagnitude = 20;
                const currentMagnitude = delta.magnitude;
                const desiredMagnitude = Math.max(delta.magnitude, minimalMagnitude);
                delta.multiplyScalar(desiredMagnitude / currentMagnitude);
                const point0 = fakePinchStartPoint.clone().add(delta);
                const point1 = fakePinchStartPoint.clone().subtract(delta);
                update(point0, point1, true);
                updateDebugDisplay(point0, point1);
            }
        }
    };
    const target = element; // Fooling typescript.
    target.addEventListener('pointerdown', onPointerDown, { capture, passive });
    target.addEventListener('touchmove', onTouch, { capture, passive });
    target.addEventListener('touchend', onTouch, { capture, passive });
    frameId = window.requestAnimationFrame(frameUpdate);
    const destroy = () => {
        target.removeEventListener('pointerdown', onPointerDown, { capture });
        target.removeEventListener('touchmove', onTouch, { capture });
        target.removeEventListener('touchend', onTouch, { capture });
        window.cancelAnimationFrame(frameId);
    };
    return { destroy };
};

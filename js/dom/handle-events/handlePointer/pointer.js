import { Point } from '../../../geom.js';
import { handleDrag, isDragListening } from './drag.js';
import { handlePinch, isPinchListening } from './pinch.js';
import { handlePointerWheel, isWheelListening } from './wheel.js';
const isTap = (downEvent, upEvent, maxDuration, maxDistance) => {
    const x = upEvent.x - downEvent.x;
    const y = upEvent.y - downEvent.y;
    return ((x * x) + (y * y) < maxDistance * maxDistance &&
        upEvent.timeStamp - downEvent.timeStamp < maxDuration * 1e3);
};
const solveTarget = (element) => {
    if (element instanceof HTMLElement) {
        return element;
    }
    if (element instanceof Window) {
        return element; // Fooling typescript.
    }
    const node = document.querySelector(element);
    if (node instanceof HTMLElement) {
        return node;
    }
    throw new Error(`Invalid selector: "${element}". No node in the document for that selector.`);
};
export const handlePointer = (target, options) => {
    // NOTE: Special case, when faking pinch with the shift key, we don't want any drag to occur.
    if (options.useFakePinch) {
        const originalOnDownIgnore = options.onDownIgnore ?? (() => false);
        options.onDownIgnore = event => {
            return originalOnDownIgnore(event) || event.shiftKey || event.altKey;
        };
    }
    const { capture = false, passive = true, onDown, onDownIgnore, onUp, onMove, onMoveDown, onMoveOver, onWindowMove, onOver, onOut, onEnter, onLeave, onContextMenu, 
    // TAP
    tapMaxDuration = .3, tapMaxDistance = 10, tapPostCallbackMinInterval = .4, multipleTapMaxInterval = .4, onTap, onDoubleTap, onTripleTap, onQuadrupleTap, multipleTapCancelPreviousTap = !!(onDoubleTap || onTripleTap || onQuadrupleTap), } = options;
    let _downEvent = null;
    const _movePoint = new Point();
    const _previousMovePoint = new Point();
    const _tapState = {
        timeoutId: -1,
        tapCount: 0,
        taps: [],
        lastCallbackTimestamp: -1,
    };
    const _onPointerMoveDown = (event) => {
        if (_downEvent?.pointerId === event.pointerId) {
            onMoveDown?.(event, _downEvent);
        }
    };
    const _onPointerMoveOver = (event) => {
        onMoveOver?.(event);
    };
    const _onPointerOver = (event) => {
        onOver?.(event);
    };
    const _onPointerOut = (event) => {
        onOut?.(event);
    };
    const _onPointerEnter = (event) => {
        window.addEventListener('pointermove', _onPointerMoveOver, { capture, passive });
        onEnter?.(event);
    };
    const _onPointerLeave = (event) => {
        window.removeEventListener('pointermove', _onPointerMoveOver, { capture });
        onLeave?.(event);
    };
    const _onPointerDown = (event) => {
        if (onDownIgnore?.(event)) {
            return;
        }
        _downEvent = event;
        _movePoint.copy(event);
        _previousMovePoint.copy(event);
        window.addEventListener('pointermove', _onPointerMoveDown, { capture, passive });
        window.addEventListener('pointerup', _onPointerUp, { capture, passive });
        onDown?.(event, _downEvent);
    };
    const _onPointerMove = (event) => {
        onMove?.(event);
    };
    const _onWindowPointerMove = (event) => {
        onWindowMove?.(event);
    };
    const _onPointerUp = (event) => {
        window.removeEventListener('pointermove', _onPointerMoveDown, { capture });
        window.removeEventListener('pointerup', _onPointerUp, { capture });
        onUp?.(event, _downEvent);
        // TAP:
        const concernTap = (!!(onTap || onDoubleTap || onTripleTap || onQuadrupleTap)
            && (event.timeStamp - _tapState.lastCallbackTimestamp) > tapPostCallbackMinInterval * 1e3
            && isTap(_downEvent, event, tapMaxDuration, tapMaxDistance));
        if (concernTap) {
            const currentTap = {
                timeStamp: event.timeStamp,
                point: new Point().copy(event),
                downEvent: _downEvent,
                upEvent: event,
            };
            const isMultiple = (_tapState.taps.length > 0
                && currentTap.timeStamp - _tapState.taps[_tapState.taps.length - 1].timeStamp < multipleTapMaxInterval * 1e3);
            _tapState.taps = isMultiple ? [..._tapState.taps, currentTap] : [currentTap];
            const resolve = () => {
                const call = (callback) => {
                    callback(currentTap);
                    _tapState.lastCallbackTimestamp = currentTap.timeStamp;
                };
                switch (_tapState.taps.length) {
                    case 1:
                        onTap && call(onTap);
                        break;
                    case 2:
                        onDoubleTap && call(onDoubleTap);
                        break;
                    case 3:
                        onTripleTap && call(onTripleTap);
                        break;
                    case 4:
                        onQuadrupleTap && call(onQuadrupleTap);
                        break;
                }
            };
            const higherCallbackExists = (() => {
                switch (_tapState.taps.length) {
                    case 1: return !!(onDoubleTap || onTripleTap || onQuadrupleTap);
                    case 2: return !!(onTripleTap || onQuadrupleTap);
                    case 3: return !!(onQuadrupleTap);
                    default: return false;
                }
            })();
            if (multipleTapCancelPreviousTap && higherCallbackExists) {
                _tapState.timeoutId = window.setTimeout(() => {
                    const lastTap = _tapState.taps[_tapState.taps.length - 1];
                    if (lastTap === currentTap) {
                        resolve();
                    }
                }, multipleTapMaxInterval * 1e3);
            }
            else {
                resolve();
            }
        }
        _downEvent = null;
    };
    const _onContextMenu = (event) => {
        onContextMenu?.(event);
    };
    const _target = solveTarget(target);
    _target.addEventListener('pointerover', _onPointerOver, { capture, passive });
    _target.addEventListener('pointerout', _onPointerOut, { capture, passive });
    _target.addEventListener('pointerenter', _onPointerEnter, { capture, passive });
    _target.addEventListener('pointerleave', _onPointerLeave, { capture, passive });
    _target.addEventListener('pointerdown', _onPointerDown, { capture, passive });
    _target.addEventListener('pointermove', _onPointerMove, { capture, passive });
    _target.addEventListener('contextmenu', _onContextMenu, { capture, passive });
    const dragListener = isDragListening(options) ? handleDrag(_target, options) : null;
    const pinchListener = isPinchListening(options) ? handlePinch(_target, options) : null;
    const wheelListener = isWheelListening(options) ? handlePointerWheel(_target, options) : null;
    if (onWindowMove) {
        window.addEventListener('pointermove', _onWindowPointerMove, { capture, passive });
    }
    const destroy = () => {
        _target.removeEventListener('pointerover', _onPointerOver, { capture });
        _target.removeEventListener('pointerout', _onPointerOut, { capture });
        _target.removeEventListener('pointerenter', _onPointerEnter, { capture });
        _target.removeEventListener('pointerleave', _onPointerLeave, { capture });
        _target.removeEventListener('pointerdown', _onPointerDown, { capture });
        _target.removeEventListener('pointermove', _onPointerMove, { capture });
        _target.removeEventListener('contextmenu', _onContextMenu, { capture });
        window.removeEventListener('pointermove', _onPointerMoveOver, { capture });
        window.removeEventListener('pointermove', _onPointerMoveDown, { capture });
        window.removeEventListener('pointerup', _onPointerUp, { capture });
        window.clearTimeout(_tapState.timeoutId);
        dragListener?.destroy();
        pinchListener?.destroy();
        wheelListener?.destroy();
        if (onWindowMove) {
            window.removeEventListener('pointermove', _onWindowPointerMove, { capture });
        }
    };
    return { destroy };
};

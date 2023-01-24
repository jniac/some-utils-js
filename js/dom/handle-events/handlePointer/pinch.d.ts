import { Point } from '../../../geom';
type PinchState = {
    /** The "exact" center of the transformation (no easings). */
    centerExact: Point;
    center: Point;
    point0: Point;
    point1: Point;
    /** `gap` leads from `point0` to `point1` */
    gap: Point;
    gapMagnitude: number;
    /** "Scale" amount that was measured during the last frame. */
    frameScale: number;
    /** Total "scale" amount that was measured since the pinch started. */
    totalScale: number;
    /** "Top" (or "z") rotation that was measured during the last frame. */
    frameRotation: number;
    /** Total "top" (or "z") rotation that was measured since the pinch started. */
    totalRotation: number;
    /** A "fake" pinch is pinch triggered with hotkeys (shift, alt), coming from a "mouse" event (and not "touch" one). */
    isFakePinch: boolean;
};
type InternalPinchInfo = {
    frame: number;
    current?: PinchState;
    old?: PinchState;
    start?: PinchState;
    totalRotation: number;
};
export type PinchInfo = Required<InternalPinchInfo>;
export type PinchOptions = Partial<{
    /** Should we use capture phase? */
    capture: boolean;
    /** Are passive listeners wanted? */
    passive: boolean;
    /** Hook that allows to ignore some down event (cancelling at the same time all other events that may follow otherwise (tap, drag etc.)). */
    onDownIgnore: (event: PointerEvent) => boolean;
    /** For debug / test purpose. [Shift] key to pinch "in" from the current touch point. [Alt] key to pinch "out" (from the center). */
    useFakePinch: boolean;
    /** Display debug pinch helpers. */
    debugPinch: boolean;
    /** When the user pans, some jitters may appear, "panDamping" helps to reduce the jitters. */
    panDamping: number;
    onPinch: (info: PinchInfo) => void;
    onPinchStart: (info: PinchInfo) => void;
    onPinchStop: (info: PinchInfo) => void;
}>;
export declare const isPinchListening: (options: PinchOptions) => boolean;
export declare const handlePinch: (element: HTMLElement | Window, options: PinchOptions) => {
    destroy: () => void;
};
export {};

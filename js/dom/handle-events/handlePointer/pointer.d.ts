import { Point } from '../../../geom';
import { DragOptions } from './drag';
import { PinchOptions } from './pinch';
import { WheelOptions } from './wheel';
type TapInfo = {
    timeStamp: number;
    point: Point;
    downEvent: PointerEvent;
    upEvent: PointerEvent;
};
export type Options = Partial<{
    /** Should we use capture phase? */
    capture: boolean;
    /** Are passive listeners wanted? */
    passive: boolean;
    /** **`down`** callback. */
    onDown: (event: PointerEvent, downEvent: PointerEvent) => void;
    /** Hook that allows to ignore some down event (cancelling at the same time all other events that may follow otherwise (tap, drag etc.)). */
    onDownIgnore: (event: PointerEvent) => boolean;
    /** **`up`** callback. */
    onUp: (event: PointerEvent, downEvent: PointerEvent) => void;
    /** **`move`** callback. */
    onMove: (event: PointerEvent) => void;
    /** **`move when down`** callback. */
    onMoveDown: (event: PointerEvent, downEvent: PointerEvent | null) => void;
    /** **`move when over`** callback. */
    onMoveOver: (event: PointerEvent) => void;
    /** **`"window" move`** callback. Sort of a hack, because ignores the targeted element to prefer the window. Useful sometimes. */
    onWindowMove: (event: PointerEvent) => void;
    /** **`over`** callback. */
    onOver: (event: PointerEvent) => void;
    /** **`out`** callback. */
    onOut: (event: PointerEvent) => void;
    /** **`enter`** callback. */
    onEnter: (event: PointerEvent) => void;
    /** **`leave`** callback. */
    onLeave: (event: PointerEvent) => void;
    /** Context menu? The right click! */
    onContextMenu: (event: PointerEvent) => void;
    /** Max *"down"* duration for a couple of **`down`** / **`up`** events to be considered as a **`tap`**.
     * @default 0.3 seconds */
    tapMaxDuration: number;
    /** Max distance between a couple of **`down`** / **`up`** events to be considered as a **`tap`**.
     * @default 10 pixels */
    tapMaxDistance: number;
    /** Min interval after a *"caught"* **`tap`** (with a callback) before start considering any new **`tap`**
     * @default 0.3 seconds */
    tapPostCallbackMinInterval: number;
    /** Max duration between two **`taps`** to be considered as a **`multiple-tap`**
     * @default 0.3 seconds */
    multipleTapMaxInterval: number;
    /** Should we wait `multipleTapMaxInterval` before resolve tap, in order to cancel previous "n-tap"?
     * @default true if (onDoubleTap || onTripleTap || onQuadrupleTap) else false */
    multipleTapCancelPreviousTap: boolean;
    /** Single tap callback. */
    onTap: (tap: TapInfo) => void;
    /** Double tap callback. */
    onDoubleTap: (tap: TapInfo) => void;
    /** Triple tap callback. */
    onTripleTap: (tap: TapInfo) => void;
    /** Quadruple tap callback! It's a lot of taps, isn't it? */
    onQuadrupleTap: (tap: TapInfo) => void;
}>;
export declare const handlePointer: (target: HTMLElement | Window | string, options: Options & DragOptions & PinchOptions & WheelOptions) => {
    destroy: () => void;
};
export {};

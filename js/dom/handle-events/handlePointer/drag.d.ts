import { Point } from '../../../geom';
export type DragDirection = 'horizontal' | 'vertical';
export type DragInfo = {
    total: Point;
    delta: Point;
    moveEvent: PointerEvent | TouchEvent;
    downEvent: PointerEvent;
    direction: DragDirection;
};
export type DragOptions = Partial<{
    /** Should we use capture phase? */
    capture: boolean;
    /** Are passive listeners wanted? */
    passive: boolean;
    /** Hook that allows to ignore some down event (cancelling at the same time all other events that may follow otherwise (tap, drag etc.)). */
    onDownIgnore: (event: PointerEvent) => boolean;
    dragDistanceThreshold: number;
    dragDamping: number;
    onDragStart: (drag: DragInfo) => void;
    onDragStop: (drag: DragInfo) => void;
    onDrag: (drag: DragInfo) => void;
    onHorizontalDragStart: (drag: DragInfo) => void;
    onHorizontalDragStop: (drag: DragInfo) => void;
    onHorizontalDrag: (drag: DragInfo) => void;
    onVerticalDragStart: (drag: DragInfo) => void;
    onVerticalDragStop: (drag: DragInfo) => void;
    onVerticalDrag: (drag: DragInfo) => void;
}>;
export declare const isDragListening: (options: DragOptions) => boolean;
export declare const handleDrag: (element: HTMLElement | Window, options: DragOptions) => {
    destroy: () => void;
};

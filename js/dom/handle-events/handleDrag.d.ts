interface HandleDragState {
    downX: number;
    downY: number;
    dragX: number;
    dragY: number;
    deltaX: number;
    deltaY: number;
    downEvent: PointerEvent;
    moveEvent: PointerEvent;
    moveEventOld: PointerEvent;
}
interface Options {
    onDrag?: (state: HandleDragState) => void;
    onDragStart?: (state: HandleDragState) => void;
    onDragEnd?: (state: HandleDragState) => void;
    distanceMin?: number;
}
export declare const handleDrag: (element: HTMLElement, { onDrag, onDragStart, onDragEnd, distanceMin, }: Options) => {
    destroy: () => void;
};
export {};

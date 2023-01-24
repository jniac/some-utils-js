export type WheelFrameInfo = {
    deltaTime: number;
    velocity: {
        x: number;
        y: number;
        z: number;
    };
    velocityOld: {
        x: number;
        y: number;
        z: number;
    };
    event: WheelEvent;
};
export type WheelOptions = Partial<{
    /** Should we use capture phase? */
    capture: boolean;
    /** Are passive listeners wanted? */
    passive: boolean;
    /** Should we ignore those wheel events? */
    onWheelIgnore: (event: WheelEvent) => boolean;
    onWheel: (event: WheelEvent) => void;
    onWheelStart: () => void;
    onWheelStop: () => void;
    onWheelFrame: (info: WheelFrameInfo) => void;
}>;
export declare const isWheelListening: (options: WheelOptions) => boolean;
export declare const handlePointerWheel: (element: HTMLElement | Window, options: WheelOptions) => {
    destroy: () => void;
};

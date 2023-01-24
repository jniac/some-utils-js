declare const requestContinuousAnimation: () => number;
declare const cancelContinuousAnimation: (id: number) => boolean;
type TimeHandlerCallbackOptions = Partial<{
    /** The bigger, the later. Default is 0. */
    order: number;
    /** Frames to skip to save computations. Default is 0. */
    skip: number;
    /** Should the callback be executed once only? Default is false. */
    once: boolean;
}>;
declare class TimerHandler {
    #private;
    uTime: {
        value: number;
    };
    get frame(): number;
    get time(): number;
    get timeOld(): number;
    get deltaTime(): number;
    get timeScale(): number;
    update(deltaTime: number, timeScale: number): void;
    onFrame(options: TimeHandlerCallbackOptions, callback: (time: TimerHandler) => void): {
        destroy: () => void;
    };
    onFrame(callback: (time: TimerHandler) => void): {
        destroy: () => void;
    };
    onChange(options: TimeHandlerCallbackOptions, callback: (time: TimerHandler) => void): {
        destroy: () => void;
    };
    onChange(callback: (time: TimerHandler) => void): {
        destroy: () => void;
    };
    passThrough(threshold: number): boolean;
}
declare const appTimer: TimerHandler;
declare const timer: TimerHandler;
type AnimationFrameProps = {
    timeBeforeFade?: number;
    fadeDuration?: number;
    maxDeltaTime?: number;
};
declare const AnimationFrame: ({ timeBeforeFade, fadeDuration, maxDeltaTime, }: AnimationFrameProps) => null;
export { requestContinuousAnimation, cancelContinuousAnimation, appTimer, timer, AnimationFrame, timer as time, appTimer as appTime, };

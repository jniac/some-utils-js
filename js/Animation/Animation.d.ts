export declare const cubic01SearchT: (x2: number, x3: number, x: number, iterations?: number, precision?: number, lowerT?: number, upperT?: number, lowerX?: number, upperX?: number) => number;
export declare const solveCubicEasing: (x1: number, y1: number, x2: number, y2: number, x: number, iterations?: number, precision?: number) => number;
export declare const easings: {
    linear: (x: number) => number;
    in1: (x: number) => number;
    in2: (x: number) => number;
    in3: (x: number) => number;
    in4: (x: number) => number;
    in5: (x: number) => number;
    in6: (x: number) => number;
    out1: (x: number) => number;
    out2: (x: number) => number;
    out3: (x: number) => number;
    out4: (x: number) => number;
    out5: (x: number) => number;
    out6: (x: number) => number;
    inout1: (x: number) => number;
    inout2: (x: number) => number;
    inout3: (x: number) => number;
    inout4: (x: number) => number;
    inout5: (x: number) => number;
    inout6: (x: number) => number;
    inout: (x: number, p?: number, i?: number) => number;
};
/**
 * Usage:
 * ```
 * const ease = Animation.getEase('inout4')
 * const ease = Animation.getEase('cubic-bezier(.5, 0, .5, 1)')
 * const ease = Animation.getEase('inout(3, .33)')
 * ```
 */
declare const getEase: (ease: EaseDeclaration) => (x: number) => number;
/**
 * Same usage than getEase():
 * ```
 * const ease = Animation.getMemoizedEase('inout4')
 * const ease = Animation.getMemoizedEase('cubic-bezier(.5, 0, .5, 1)')
 * const ease = Animation.getMemoizedEase('inout(3, .33)')
 * ```
 */
declare const getMemoizedEase: (ease: EaseDeclaration) => (x: number) => number;
type AnimationCallback = (animation: AnimationInstance) => any;
declare let count: number;
declare class AnimationInstance {
    id: number;
    startTime: number;
    startFrame: number;
    timeScale: number;
    paused: boolean;
    time: number;
    timeOld: number;
    deltaTime: number;
    duration: number;
    autoDestroy: boolean;
    destroyed: boolean;
    frame: number;
    get normalizedTime(): number;
    get progress(): number;
    get progressOld(): number;
    get global(): {
        readonly time: number;
        readonly timeOld: number;
        readonly deltaTime: number;
        readonly frame: number;
        readonly targetCount: number;
    };
    get complete(): boolean;
    get completeOld(): boolean;
    destroy: () => AnimationInstance;
    constructor(cb?: AnimationCallback);
    passedThrough(threshold?: number | {
        time?: number | undefined;
        progress?: number | undefined;
        frame?: number | undefined;
    }): boolean;
    pause(): this;
    /**
     * Play the animation (on next tick), from the current time, or from the given params.
     * @param param
     */
    play({ time, progress }?: {
        time?: number | undefined;
        progress?: number | undefined;
    }): this;
    playOneFrame(): this;
    setTime(value: number): this;
    setProgress(value: number): this;
    triggerFrameCallbacks(): this;
    onStart(cb?: AnimationCallback): this;
    onFrame(cb?: AnimationCallback): this;
    onProgress(cb?: AnimationCallback): this;
    onComplete(cb?: AnimationCallback): this;
    onDestroy(cb?: AnimationCallback): this;
    waitDestroy(): Promise<AnimationInstance> | null;
    waitCompletion(): Promise<AnimationInstance> | null;
    waitNextFrame(): Promise<AnimationInstance> | null;
    waitFrames(): AsyncGenerator<AnimationInstance, void, unknown>;
    [Symbol.asyncIterator](): AsyncGenerator<AnimationInstance, void, unknown>;
    toString(): string;
}
declare const BREAK: unique symbol;
declare const update: (_deltaTime: number) => void;
declare const breakAutoUpdate: () => void;
declare const loop: (cb: AnimationCallback) => AnimationInstance;
declare const loopWithTarget: (target: any, cb: AnimationCallback) => AnimationInstance;
declare const loopCancelTarget: (target: any) => void;
type AnimationParam = {
    duration: number;
    delay?: number;
    immediate?: boolean;
    paused?: boolean;
    autoDestroy?: boolean;
} | [number, number?, boolean?] | number;
declare const during: (timing: AnimationParam, cb?: AnimationCallback) => AnimationInstance;
declare const duringWithTarget: (target: any, timing: AnimationParam, cb?: AnimationCallback) => AnimationInstance;
declare const duringCancelTarget: (target: any) => void;
declare const wait: (duration: number) => Promise<AnimationInstance>;
declare const waitFrames: (frameCount: number) => Promise<AnimationInstance>;
type EaseDeclaration = ((t: number) => number) | (keyof typeof easings) | `cubic-bezier(${number}, ${number}, ${number}, ${number})` | `inout(${number}, ${number})` | null | undefined;
type TweenParams<T> = {
    from?: T | Partial<Record<keyof T, any>>;
    to?: T | Partial<Record<keyof T, any>>;
    ease?: EaseDeclaration;
    onChange?: AnimationCallback;
    /** Alias for "onChange" */
    onProgress?: AnimationCallback;
    onComplete?: AnimationCallback;
};
declare const tween: <T>(target: T, timing: AnimationParam, { from, to, ease, onProgress, onChange, onComplete, }: TweenParams<T>) => AnimationInstance;
declare const cancelTween: (target: any) => void;
/**
 * Returns true if there's currently an animation on target.
 */
declare const hasTarget: (target: any) => boolean;
/**
 * Same as hasTarget(), sugar syntax.
 */
declare const hasTween: (target: any) => boolean;
declare const info: {
    readonly time: number;
    readonly timeOld: number;
    readonly deltaTime: number;
    readonly frame: number;
    readonly targetCount: number;
};
export { count, breakAutoUpdate, update, info, BREAK, loop, loopWithTarget, loopCancelTarget, during, duringWithTarget, duringCancelTarget, wait, waitFrames, tween, cancelTween, hasTarget, hasTween, getEase, getMemoizedEase, };
export type { AnimationInstance, };
export declare const Animation: {
    breakAutoUpdate: () => void;
    update: (_deltaTime: number) => void;
    info: {
        readonly time: number;
        readonly timeOld: number;
        readonly deltaTime: number;
        readonly frame: number;
        readonly targetCount: number;
    };
    BREAK: symbol;
    loop: (cb: AnimationCallback) => AnimationInstance;
    loopWithTarget: (target: any, cb: AnimationCallback) => AnimationInstance;
    loopCancelTarget: (target: any) => void;
    during: (timing: AnimationParam, cb?: AnimationCallback) => AnimationInstance;
    duringWithTarget: (target: any, timing: AnimationParam, cb?: AnimationCallback) => AnimationInstance;
    duringCancelTarget: (target: any) => void;
    wait: (duration: number) => Promise<AnimationInstance>;
    waitFrames: (frameCount: number) => Promise<AnimationInstance>;
    tween: <T>(target: T, timing: AnimationParam, { from, to, ease, onProgress, onChange, onComplete, }: TweenParams<T>) => AnimationInstance;
    cancelTween: (target: any) => void;
    hasTarget: (target: any) => boolean;
    hasTween: (target: any) => boolean;
    getEase: (ease: EaseDeclaration) => (x: number) => number;
    getMemoizedEase: (ease: EaseDeclaration) => (x: number) => number;
    AnimationInstance: typeof AnimationInstance;
};

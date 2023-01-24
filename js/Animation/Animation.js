const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
const clamp = (x, min = 0, max = 1) => x < min ? min : x > max ? max : x;
const lerp = (a, b, t) => a + (b - a) * t;
const nothing = [][Symbol.iterator]();
// EASINGS >
// CUBIC-BEZIER >
const cubic01 = (x2, x3, t) => {
    const ti = 1 - t;
    const t2 = t * t;
    return (+3 * ti * ti * t * x2
        + 3 * ti * t2 * x3
        + t2 * t);
};
export const cubic01SearchT = (x2, x3, x, iterations = 6, precision = 0.0001, lowerT = 0, upperT = 1, lowerX = 0, upperX = 1) => {
    if (x <= precision) {
        return 0;
    }
    if (x >= 1 - precision) {
        return 1;
    }
    let diffX = 0, currentX = 0, currentT = 0;
    for (let i = 0; i < iterations; i++) {
        currentT = (lowerT + upperT) / 2;
        currentX = cubic01(x2, x3, currentT);
        diffX = x - currentX;
        if (Math.abs(diffX) <= precision) {
            return currentT;
        }
        if (diffX < 0) {
            upperT = currentT;
            upperX = currentX;
        }
        else {
            lowerT = currentT;
            lowerX = currentX;
        }
    }
    // return the final linear interpolation between lower and upper bounds
    return lowerT + (upperT - lowerT) * (x - lowerX) / (upperX - lowerX);
};
export const solveCubicEasing = (x1, y1, x2, y2, x, iterations, precision) => {
    const t = cubic01SearchT(x1, x2, x, iterations, precision);
    const y = cubic01(y1, y2, t);
    return y;
};
// CUBIC-BEZIER <
export const easings = (() => {
    const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
    const linear = clamp01;
    const in1 = clamp01;
    const in2 = (x) => clamp01(x * x);
    const in3 = (x) => clamp01(x * x * x);
    const in4 = (x) => clamp01(x * x * x * x);
    const in5 = (x) => clamp01(x * x * x * x * x);
    const in6 = (x) => clamp01(x * x * x * x * x * x);
    const out1 = clamp01;
    const out2 = (x) => clamp01(1 - (x = 1 - x) * x);
    const out3 = (x) => clamp01(1 - (x = 1 - x) * x * x);
    const out4 = (x) => clamp01(1 - (x = 1 - x) * x * x * x);
    const out5 = (x) => clamp01(1 - (x = 1 - x) * x * x * x * x);
    const out6 = (x) => clamp01(1 - (x = 1 - x) * x * x * x * x * x);
    const inout1 = clamp01;
    const inout2 = (x) => clamp01(x < .5 ? 2 * x * x : 1 - 2 * (x = 1 - x) * x);
    const inout3 = (x) => clamp01(x < .5 ? 4 * x * x * x : 1 - 4 * (x = 1 - x) * x * x);
    const inout4 = (x) => clamp01(x < .5 ? 8 * x * x * x * x : 1 - 8 * (x = 1 - x) * x * x * x);
    const inout5 = (x) => clamp01(x < .5 ? 16 * x * x * x * x * x : 1 - 16 * (x = 1 - x) * x * x * x * x);
    const inout6 = (x) => clamp01(x < .5 ? 32 * x * x * x * x * x * x : 1 - 32 * (x = 1 - x) * x * x * x * x * x);
    const inout = (x, p = 3, i = 0.5) => {
        return (x < 0 ? 0 : x > 1 ? 1 : x < i
            ? 1 / Math.pow(i, p - 1) * Math.pow(x, p)
            : 1 - 1 / Math.pow(1 - i, p - 1) * Math.pow(1 - x, p));
    };
    return {
        linear,
        in1, in2, in3, in4, in5, in6,
        out1, out2, out3, out4, out5, out6,
        inout1, inout2, inout3, inout4, inout5, inout6,
        inout,
    };
})();
/**
 * Usage:
 * ```
 * const ease = Animation.getEase('inout4')
 * const ease = Animation.getEase('cubic-bezier(.5, 0, .5, 1)')
 * const ease = Animation.getEase('inout(3, .33)')
 * ```
 */
const getEase = (ease) => {
    if (typeof ease === 'function') {
        return ease;
    }
    if (typeof ease === 'string') {
        if (ease.startsWith('cubic-bezier')) {
            const [x1, y1, x2, y2] = ease
                .slice(13, -1)
                .split(/\s*,\s*/)
                .map(s => Number.parseFloat(s));
            return (x) => solveCubicEasing(x1, y1, x2, y2, x);
        }
        else if (ease in easings) {
            return easings[ease];
        }
        // inout(.5, 3)
        else if (ease.startsWith('inout')) {
            const [power = 3, inflexion = .5] = ease
                .slice(6, -1)
                .split(/\s*,\s*/)
                .map(s => Number.parseFloat(s));
            return (x) => easings.inout(x, power, inflexion);
        }
    }
    return easings.linear;
};
const easeMap = new Map();
/**
 * Same usage than getEase():
 * ```
 * const ease = Animation.getMemoizedEase('inout4')
 * const ease = Animation.getMemoizedEase('cubic-bezier(.5, 0, .5, 1)')
 * const ease = Animation.getMemoizedEase('inout(3, .33)')
 * ```
 */
const getMemoizedEase = (ease) => {
    // Only "string" ease are memoized (lambda / arrow function could be new at each call). 
    if (typeof ease === 'string') {
        let value = easeMap.get(ease);
        if (value === undefined) {
            value = getEase(ease);
            easeMap.set(ease, value);
        }
        return value;
    }
    return getEase(ease);
};
// EASINGS <
// OBJECT >
/**
 * Clone a value. If value is an object will return a shallow clone.
 * Used by tween().
 */
const cloneValue = (value) => {
    if (value && typeof value === 'object') {
        const clone = new value.constructor();
        for (const key in value) {
            clone[key] = value[key];
        }
        return clone;
    }
    return value;
};
const copyValueTo = (source, destination) => {
    for (const key in source) {
        const value = source[key];
        if (value && typeof value === 'object') {
            copyValueTo(value, destination[key]);
        }
        else {
            source[key] = value;
        }
    }
};
// OBJECT <
let time = 0;
let timeOld = 0;
let deltaTime = 0;
let frame = 0;
class CallbackMap extends Map {
    add(animation, cb) {
        const create = (animation) => {
            const set = new Set();
            this.set(animation, set);
            return set;
        };
        const set = this.get(animation) ?? create(animation);
        set.add(cb);
    }
    getAndDelete(animation) {
        const set = this.get(animation);
        if (set) {
            this.delete(animation);
        }
        return set;
    }
}
const destroyCallbacks = new CallbackMap();
const startCallbacks = new CallbackMap();
const completeCallbacks = new CallbackMap();
const frameCallbacks = new CallbackMap();
const nextFrameCallbacks = new CallbackMap();
let count = 0;
class AnimationInstance {
    id = count++;
    startTime = time;
    startFrame = frame;
    timeScale = 1;
    paused = false;
    time = 0;
    timeOld = 0;
    deltaTime = 0;
    duration = Infinity;
    autoDestroy = true; // autoDestroy on complete?
    destroyed = false;
    frame = 0;
    get normalizedTime() { return clamp(this.time, 0, this.duration); }
    get progress() { return clamp(this.time / this.duration, 0, 1); }
    get progressOld() { return clamp(this.timeOld / this.duration, 0, 1); }
    get global() { return info; }
    get complete() { return this.time >= this.duration; }
    get completeOld() { return this.timeOld >= this.duration; }
    destroy;
    constructor(cb) {
        // destroy must be binded
        this.destroy = () => {
            if (this.destroyed === false) {
                destroyedAnimations.add(this);
                this.destroyed = true;
            }
            return this;
        };
        this.onFrame(cb);
        addAnimation(this);
    }
    passedThrough(threshold = {}) {
        const { time, progress = undefined, frame = undefined } = typeof threshold === 'number' ? { time: threshold } : threshold;
        if (time !== undefined) {
            return this.time >= time && this.timeOld < time;
        }
        if (progress !== undefined) {
            return this.progress >= progress && this.progressOld < progress;
        }
        if (frame !== undefined) {
            return this.frame === frame;
        }
        return false;
    }
    pause() {
        this.paused = true;
        return this;
    }
    /**
     * Play the animation (on next tick), from the current time, or from the given params.
     * @param param
     */
    play({ time, progress } = {}) {
        this.paused = false;
        // NOTE: time is modified here, but without "jumps".
        // Any effects will happen on next tick.
        if (progress !== undefined) {
            time = progress * this.duration;
        }
        if (time !== undefined) {
            this.time = time;
        }
        return this;
    }
    playOneFrame() {
        this.play()
            .waitNextFrame()
            ?.then(() => this.pause());
        return this;
    }
    setTime(value) {
        if (value !== this.time) {
            // NOTE: A clamp is required here.
            updateAnimation(this, value);
        }
        return this;
    }
    setProgress(value) {
        return this.setTime(clamp01(value) * this.duration);
    }
    triggerFrameCallbacks() {
        for (const cb of frameCallbacks.get(this) ?? nothing) {
            cb(this);
        }
        return this;
    }
    onStart(cb) {
        if (this.destroyed === false && cb) {
            startCallbacks.add(this, cb);
        }
        return this;
    }
    onFrame(cb) {
        if (this.destroyed === false && cb) {
            frameCallbacks.add(this, cb);
        }
        return this;
    }
    // alias
    onProgress(cb) {
        return this.onFrame(cb);
    }
    onComplete(cb) {
        if (this.destroyed === false && cb) {
            completeCallbacks.add(this, cb);
        }
        return this;
    }
    onDestroy(cb) {
        if (this.destroyed === false && cb) {
            destroyCallbacks.add(this, cb);
        }
        return this;
    }
    waitDestroy() {
        if (this.destroyed) {
            return null;
        }
        return new Promise(resolve => destroyCallbacks.add(this, resolve));
    }
    waitCompletion() {
        if (this.destroyed || this.complete) {
            return null;
        }
        return new Promise(resolve => completeCallbacks.add(this, resolve));
    }
    waitNextFrame() {
        if (this.destroyed) {
            return null;
        }
        return new Promise(resolve => nextFrameCallbacks.add(this, resolve));
    }
    async *waitFrames() {
        while (await this.waitNextFrame()) {
            yield this;
        }
    }
    async *[Symbol.asyncIterator]() {
        yield* this.waitFrames();
    }
    toString() {
        const { id, frame, time, progress } = this;
        return `Animation#${id}{ f:${frame} t:${time.toFixed(4)} p:${progress.toFixed(4)} }`;
    }
}
const animations = new Set();
const newAnimations = new Set();
const destroyedAnimations = new Set();
const BREAK = Symbol('Animation.BREAK');
const addAnimation = (animation) => {
    (updating ? newAnimations : animations).add(animation);
};
const updateAnimation = (animation, animationTime) => {
    // NOTE: try/catch has zero performance penalty with Chrome V8 version > 6 
    try {
        animation.timeOld = animation.time;
        animation.time = animationTime;
        animation.deltaTime = animationTime - animation.timeOld;
        if (animation.time >= 0) {
            let done = false;
            if (animation.frame === 0) {
                for (const cb of startCallbacks.get(animation) ?? nothing) {
                    done = (cb(animation) === BREAK) || done;
                }
            }
            animation.frame += 1;
            for (const cb of frameCallbacks.get(animation) ?? nothing) {
                done = (cb(animation) === BREAK) || done;
            }
            for (const cb of nextFrameCallbacks.getAndDelete(animation) ?? nothing) {
                done = (cb(animation) === BREAK) || done;
            }
            if (animation.complete && animation.completeOld === false) {
                for (const cb of completeCallbacks.get(animation) ?? nothing) {
                    cb(animation);
                }
            }
            if (animation.autoDestroy && (done || animation.complete)) {
                animation.destroy();
            }
        }
    }
    catch (error) {
        console.log(`Animation caught an error. To prevent any further error the instance will be destroyed.`);
        console.log(animation.toString());
        console.error(error);
        animation.destroy();
    }
};
const destroyAnimation = (animation) => {
    animations.delete(animation);
    frameCallbacks.delete(animation);
    nextFrameCallbacks.delete(animation);
    const set = destroyCallbacks.getAndDelete(animation);
    if (set) {
        for (const cb of set) {
            cb(animation);
        }
    }
};
let updating = false;
const update = (_deltaTime) => {
    deltaTime = _deltaTime;
    timeOld = time;
    time = time + deltaTime;
    frame++;
    updating = true;
    for (const animation of animations) {
        if (animation.destroyed === false && animation.paused === false) {
            const animationTime = animation.time + deltaTime * animation.timeScale;
            updateAnimation(animation, animationTime);
        }
    }
    for (const animation of destroyedAnimations) {
        destroyAnimation(animation);
    }
    destroyedAnimations.clear();
    for (const animation of newAnimations) {
        animations.add(animation);
    }
    updating = false;
};
let autoUpdate = true;
let msOld = 0, msDelta = 0;
const _innerLoop = (ms) => {
    if (autoUpdate) {
        window.requestAnimationFrame(_innerLoop);
        msDelta = ms - msOld;
        msOld = ms;
        update(msDelta / 1e3);
    }
};
window.requestAnimationFrame(ms => {
    msOld = ms;
    _innerLoop(ms);
});
const breakAutoUpdate = () => {
    autoUpdate = false;
};
// API:
/**
 * Small utility to handle animation with target.
 *
 * When an animation is "set()", it automatically checks for a previous and, if so, destroy it.
 */
class AnimationMap {
    map = new Map();
    get(target) {
        return this.map.get(target);
    }
    set(target, animation) {
        this.map.get(target)?.destroy();
        this.map.set(target, animation);
        animation.onDestroy(() => {
            // IMPORTANT: check that animation has not been overrided before delete it
            if (this.map.get(target) === animation) {
                this.map.delete(target);
            }
        });
        return animation;
    }
}
const loop = (cb) => new AnimationInstance(cb);
const loopMap = new AnimationMap();
const loopWithTarget = (target, cb) => {
    return loopMap.set(target, loop(cb));
};
const loopCancelTarget = (target) => {
    loopMap.get(target)?.destroy();
};
const fromAnimationParam = (timingParam) => {
    if (typeof timingParam === 'number') {
        return { duration: timingParam, delay: 0 };
    }
    if (Array.isArray(timingParam)) {
        const [duration, delay, immediate] = timingParam;
        return { duration, delay, immediate };
    }
    return timingParam;
};
const during = (timing, cb) => {
    const animation = new AnimationInstance(cb);
    const { duration, delay = 0, immediate = false, paused = false, autoDestroy = true, } = fromAnimationParam(timing);
    animation.duration = duration;
    animation.paused = paused;
    animation.time = -delay;
    animation.autoDestroy = autoDestroy;
    if (immediate) {
        cb?.(animation);
    }
    return animation;
};
const duringMap = new AnimationMap();
const duringWithTarget = (target, timing, cb = () => { }) => {
    return duringMap.set(target, during(timing, cb));
};
const duringCancelTarget = (target) => {
    duringMap.get(target)?.destroy();
};
const wait = (duration) => during(duration).waitDestroy();
const waitFrames = (frameCount) => loop(({ frame }) => {
    if (frame >= frameCount)
        return BREAK;
}).waitDestroy();
const isFineControlWrapper = (value) => {
    return value && typeof value === 'object' && 'value' in value;
};
const ensureFineControlWrapper = (value) => {
    return isFineControlWrapper(value) ? value : { value };
};
const tween = (target, timing, { from, to, ease, onProgress, onChange = onProgress, onComplete, }) => {
    const keys = new Set([...Object.keys(from ?? {}), ...Object.keys(to ?? {})]);
    const _from = Object.fromEntries([...keys].map(key => {
        const value = cloneValue(from?.[key] ?? target[key]);
        return [key, value];
    }));
    const _to = Object.fromEntries([...keys].map(key => {
        const value = cloneValue(to?.[key] ?? target[key]);
        return [key, value];
    }));
    const _ease = getEase(ease);
    const tweenLerp = (target, from, to, alphaFlat, alphaEase) => {
        const keys = new Set();
        for (const key in from) {
            keys.add(key);
        }
        for (const key in to) {
            keys.add(key);
        }
        for (const key of keys) {
            const fromValue = ensureFineControlWrapper(from[key]);
            const toValue = ensureFineControlWrapper(to[key]);
            const transform = fromValue.transform ?? toValue.transform;
            const ease = fromValue.ease ?? toValue.ease;
            const alpha = ease ? getMemoizedEase(ease)(alphaFlat) : alphaEase;
            const currentValue = target[key];
            if (currentValue === null || currentValue === undefined) {
                continue;
            }
            switch (typeof currentValue) {
                case 'number': {
                    const value = lerp(fromValue.value, toValue.value, alpha);
                    target[key] = transform ? transform(value, fromValue.value, toValue.value) : value;
                    break;
                }
                case 'object': {
                    tweenLerp(target[key], fromValue.value, toValue.value, alphaFlat, alpha);
                    if (transform) {
                        const value = transform(target[key], fromValue.value, toValue.value);
                        copyValueTo(value, target[key]);
                    }
                }
            }
        }
    };
    const anim = duringWithTarget(target, timing, ({ progress }) => {
        const alpha = _ease(progress);
        tweenLerp(target, _from, _to, progress, alpha);
    });
    if (onChange) {
        anim.onFrame(onChange);
    }
    if (onComplete) {
        anim.onComplete(onComplete);
    }
    return anim;
};
// syntax sugar / short hand
const cancelTween = duringCancelTarget;
/**
 * Returns true if there's currently an animation on target.
 */
const hasTarget = (target) => {
    return !!duringMap.get(target);
};
/**
 * Same as hasTarget(), sugar syntax.
 */
const hasTween = (target) => hasTarget(target);
const info = {
    get time() { return time; },
    get timeOld() { return timeOld; },
    get deltaTime() { return deltaTime; },
    get frame() { return frame; },
    get targetCount() { return loopMap.map.size + duringMap.map.size; },
};
export { count, breakAutoUpdate, update, info, BREAK, loop, loopWithTarget, loopCancelTarget, during, duringWithTarget, duringCancelTarget, wait, waitFrames, tween, cancelTween, hasTarget, hasTween, getEase, getMemoizedEase, };
export const Animation = {
    breakAutoUpdate,
    update,
    info,
    BREAK,
    loop,
    loopWithTarget,
    loopCancelTarget,
    during,
    duringWithTarget,
    duringCancelTarget,
    wait,
    waitFrames,
    tween,
    cancelTween,
    hasTarget,
    hasTween,
    getEase,
    getMemoizedEase,
    AnimationInstance,
};

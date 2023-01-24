// @ts-ignore (ignore none-existing module, of course if module does not exist this file should not be imported)
import { useEffect } from 'react';
import { inout3, inverseLerp } from '../../math.js';
import { OrderSet } from '../../collections.js';
const requestContinuousAnimationSet = new Set();
let requestContinuousAnimationCount = 0;
const requestContinuousAnimation = () => {
    const id = requestContinuousAnimationCount++;
    requestContinuousAnimationSet.add(id);
    return id;
};
const cancelContinuousAnimation = (id) => {
    return requestContinuousAnimationSet.delete(id);
};
class TimerHandler {
    #frame = 0;
    #time = 0;
    #timeOld = 0;
    #deltaTime = 0;
    #callbacks = new OrderSet();
    #timeScale = 1;
    #broken = false;
    uTime = { value: 0 }; // Shorthand for shaders.
    get frame() { return this.#frame; }
    get time() { return this.#time; }
    get timeOld() { return this.#timeOld; }
    get deltaTime() { return this.#deltaTime; }
    get timeScale() { return this.#timeScale; }
    update(deltaTime, timeScale) {
        if (this.#broken === false) {
            deltaTime *= timeScale;
            const freezed = deltaTime === 0 && this.#time === this.#timeOld;
            if (freezed === false) {
                this.#timeScale = timeScale;
                this.#deltaTime = deltaTime;
                this.#timeOld = this.#time;
                this.#time += deltaTime;
                this.#frame++;
                this.uTime.value = this.#time;
                try {
                    for (const callback of this.#callbacks.values()) {
                        callback(this);
                    }
                }
                catch (error) {
                    console.error(`TimeHandler caught an error. Break incoming loops.`);
                    console.error(error);
                    this.#broken = true;
                }
            }
        }
    }
    onFrame(...args) {
        // @ts-ignore
        return this.onChange(...args);
    }
    onChange(...args) {
        const resolveArgs = () => {
            if (args.length === 1) {
                return [{}, args[0]];
            }
            else if (args.length === 2) {
                return args;
            }
            else {
                throw new Error('Oups');
            }
        };
        const [{ order = 0, skip = 0, once = false }, callback] = resolveArgs();
        const isSpecial = skip > 0 || once;
        const getSpecialCallback = () => () => {
            if (this.#frame % (skip + 1) === 0) {
                callback(this);
                if (once) {
                    destroy();
                }
            }
        };
        const finalCallback = isSpecial ? getSpecialCallback() : callback;
        this.#callbacks.add(order, finalCallback);
        const destroy = () => {
            this.#callbacks.delete(order, finalCallback);
        };
        return { destroy };
    }
    passThrough(threshold) {
        return this.#timeOld < threshold && this.#time >= threshold;
    }
}
const appTimer = new TimerHandler();
const timer = new TimerHandler();
const AnimationFrame = ({ timeBeforeFade = 30, fadeDuration = 1, maxDeltaTime = 1 / 10, }) => {
    useEffect(() => {
        let lastRenderRequestTime = 0;
        const innerContinuousRequestSet = new Set();
        let animationFrameId = -1, msOld = -1;
        const animationFrame = (ms) => {
            animationFrameId = window.requestAnimationFrame(animationFrame);
            const deltaTime = Math.min((ms - msOld) / 1e3, maxDeltaTime);
            msOld = ms;
            appTimer.update(deltaTime, 1);
            // Prevent auto pause if any continuous request
            if (requestContinuousAnimationSet.size > 0 || innerContinuousRequestSet.size > 0) {
                lastRenderRequestTime = appTimer.time;
            }
            const elapsed = appTimer.time - lastRenderRequestTime;
            const timeScale = inout3(1 - inverseLerp(timeBeforeFade, timeBeforeFade + fadeDuration, elapsed));
            timer.update(deltaTime, timeScale);
        };
        const firstFrame = (ms) => {
            animationFrameId = window.requestAnimationFrame(animationFrame);
            const deltaTime = 1 / 60;
            msOld = ms - deltaTime;
            appTimer.update(deltaTime, 1);
            timer.update(deltaTime, 1);
        };
        animationFrameId = window.requestAnimationFrame(firstFrame);
        const onInteraction = () => lastRenderRequestTime = appTimer.time;
        window.addEventListener('pointermove', onInteraction, { capture: true });
        window.addEventListener('touchstart', onInteraction, { capture: true });
        window.addEventListener('touchmove', onInteraction, { capture: true });
        window.addEventListener('touchend', onInteraction, { capture: true });
        window.addEventListener('pointerdown', onInteraction, { capture: true });
        window.addEventListener('pointerup', onInteraction, { capture: true });
        window.addEventListener('popstate', onInteraction, { capture: true });
        window.addEventListener('wheel', onInteraction, { capture: true });
        window.addEventListener('keydown', onInteraction, { capture: true });
        // continuous request / release
        const onKeyDown = (event) => innerContinuousRequestSet.add(event.code);
        const onKeyUp = (event) => innerContinuousRequestSet.delete(event.code);
        const onPointerDown = (event) => innerContinuousRequestSet.add(`${event.pointerType}-${event.pointerId}`);
        const onPointerUp = (event) => innerContinuousRequestSet.delete(`${event.pointerType}-${event.pointerId}`);
        window.addEventListener('keydown', onKeyDown, { capture: true });
        window.addEventListener('keyup', onKeyUp, { capture: true });
        window.addEventListener('pointerdown', onPointerDown, { capture: true });
        window.addEventListener('pointerup', onPointerUp, { capture: true });
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('pointermove', onInteraction, { capture: true });
            window.removeEventListener('touchstart', onInteraction, { capture: true });
            window.removeEventListener('touchmove', onInteraction, { capture: true });
            window.removeEventListener('touchend', onInteraction, { capture: true });
            window.removeEventListener('pointerdown', onInteraction, { capture: true });
            window.removeEventListener('pointerup', onInteraction, { capture: true });
            window.removeEventListener('popstate', onInteraction, { capture: true });
            window.removeEventListener('wheel', onInteraction, { capture: true });
            window.removeEventListener('keydown', onInteraction, { capture: true });
            // continuous request / release
            window.removeEventListener('keypress', onKeyDown, { capture: true });
            window.removeEventListener('keyup', onKeyUp, { capture: true });
            window.removeEventListener('pointerdown', onPointerDown, { capture: true });
            window.removeEventListener('pointerup', onPointerUp, { capture: true });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeBeforeFade, fadeDuration]);
    return null;
};
export { requestContinuousAnimation, cancelContinuousAnimation, appTimer, timer, AnimationFrame, 
// Backward compatibility...
timer as time, appTimer as appTime, };

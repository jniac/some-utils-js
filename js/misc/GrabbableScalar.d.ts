type MinMaxParams1 = Partial<{
    min: number;
    max: number;
    margin: number;
    minMargin: number;
    maxMargin: number;
    useInnerMargin: boolean;
}>;
type MinMaxParams2 = Partial<{
    outerMin: number;
    innerMin: number;
    innerMax: number;
    outerMax: number;
}>;
/**
 * GrabbableScalar is for handling a clamped value that can be grabbed (by the user).
 *
 * When the value is not grabbed, if the value is outside the bounds "update()" will
 * interpolate back the value to its nearest bounds.
 *
 * If the value is grabbed, then the retrieved value is clamped throught the "limit" function:
 * - https://www.desmos.com/calculator/zq9kbt3xww
 * - https://www.desmos.com/calculator/zkjchucsqz
 *
 * Usage:
 * ```
 * const position = new GrabbableScalar(0, { min: 0, max: 10, margin: 2, useInnerMargin: false })
 * const onDrag = (x: number) => {
 *   position.grab() // or position.grabbed = true
 *   position.valueGrab = x
 * }
 * const onDragStop = () => {
 *   position.release() // or position.grabbed = false
 * }
 * const onUpdate = () => {
 *   position.update()
 *   myComponent.x = position.value
 * }
 * ```
 */
export declare class GrabbableScalar {
    #private;
    rawGrabValue: number;
    easeValue: number;
    min: number;
    max: number;
    minMargin: number;
    maxMargin: number;
    useInnerMargin: boolean;
    easeDamping: number;
    get value(): number;
    set value(value: number);
    get grabbed(): boolean;
    set grabbed(value: boolean);
    get innerMax(): number;
    get outerMax(): number;
    get innerMin(): number;
    get outerMin(): number;
    constructor(value?: number, minMaxParams?: MinMaxParams1);
    constructor(value?: number, minMaxParams?: MinMaxParams2);
    getValue(): number;
    setValue(value: number): void;
    setMinMax(params: MinMaxParams1): this;
    setMinMax(params: MinMaxParams2): this;
    getInnerMinMax(): {
        min: number;
        max: number;
    };
    /**
     * Returns the "limited grab value", according to the limit function decay:
     * - https://www.desmos.com/calculator/zq9kbt3xww
     * - https://www.desmos.com/calculator/zkjchucsqz
     */
    getLimitedGrabValue(): number;
    clampValueEase(): this;
    setGrabbed(value: boolean): this;
    grab(): this;
    release(): this;
    update(): this;
}
export {};

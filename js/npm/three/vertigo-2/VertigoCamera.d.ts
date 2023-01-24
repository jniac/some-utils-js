import { Euler, PerspectiveCamera, Vector3 } from 'three';
type Base = {
    /** The "height" of the camera (this is really the height when fov = 0, otherwise it represents the height of the "frame" at the focus point). */
    height: number;
    /** Field Of View, in degree (because ThreeJS) */
    fov: number;
    /** Represents the focus point. Where the camera is looking at. Where the "height" makes sense. */
    focusPosition: Vector3;
    /** The position of the camera. Derives from focusPosition. */
    position: Vector3;
    /** The rotation of the camera in euler representation. YXZ ordered. */
    rotation: Euler;
};
type Options = {
    /** A minimum height, because it's handy to handle that from the camera it self.  */
    heightMin: number;
    /** A maximum height, because it's handy to handle that from the camera it self.  */
    heightMax: number;
    /** Distance "before" the focus point to be rendered. */
    rangeMin: number;
    /** Distance "behind" the focus point to be rendered. */
    rangeMax: number;
    /** "near" min value.  */
    nearMin: number;
    /** "far" min value.  */
    farMax: number;
    /** Threshold below which the camera is considered as being orthographic. Approximately 1° */
    fovEpsilon: number;
};
export declare const updateVertigoCamera: (camera: PerspectiveCamera, focusPosition: Vector3, height: number, aspect: number, rangeMin?: number, rangeMax?: number, nearMin?: number, farMax?: number, fovEpsilon?: number) => void;
export declare class VertigoCamera extends PerspectiveCamera implements Base, Options {
    #private;
    rangeMin: number;
    rangeMax: number;
    nearMin: number;
    farMax: number;
    fovEpsilon: number;
    focusPosition: any;
    setHeight(value: number): void;
    setHeightMin(value: number): void;
    setHeightMax(value: number): void;
    get height(): number;
    get heightMin(): number;
    get heightMax(): number;
    set height(value: number);
    set heightMin(value: number);
    set heightMax(value: number);
    updateVertigoCamera(): void;
    throwNaN(): void;
    update(): void;
    constructor();
    getSerializedProps(): {
        aspect: any;
        fov: any;
        fovEpsilon: number;
        height: number;
        heightMin: number;
        heightMax: number;
        rangeMin: number;
        rangeMax: number;
        nearMin: number;
        farMax: number;
        focusPositionX: any;
        focusPositionY: any;
        focusPositionZ: any;
        rotationX: any;
        rotationY: any;
        rotationZ: any;
    };
    setSerializedProps({ aspect, fov, fovEpsilon, height, heightMin, heightMax, rangeMin, rangeMax, nearMin, farMax, focusPositionX, focusPositionY, focusPositionZ, rotationX, rotationY, rotationZ, }: Partial<ReturnType<VertigoCamera['getSerializedProps']>>): void;
    copy(other: this): this;
    clone(): this;
    lerpCameras(a: this, b: this, alpha: number): this;
    lerp(other: this, alpha: number): this;
    /**
     * Moves the camera according to its orientation.
     * @param v
     * @param options
     */
    move(v: Vector3, options?: {
        scalar: number;
    }): this;
    move(x: number, y: number, z: number, options?: {
        scalar: number;
    }): this;
    /**
     * Adjust the focusPosition to keep a constant distance with an hypothetic target.
     * @param signedDistance The current distance (signed distance).
     * @param desiredDistance The desired distance.
     */
    maintainDistance(signedDistance: number, desiredDistance: number): this;
    /**
     * Change the current height, and the focus position to make a "zoom" effect.
     * @param height The new height value.
     * @param screenPoint Screen point (NDC coordinates).
     */
    applyHeight(height: number, { x, y }?: {
        x?: number | undefined;
        y?: number | undefined;
    }): this;
    applyZoom(ratio: number, { x, y }?: {
        x?: number | undefined;
        y?: number | undefined;
    }): this;
    getDistance(): number;
    /**
     * NOTE: Not sure of this function. Does it do what it should do?
     */
    setDistance(value: number): void;
    get perspective(): number;
    set perspective(value: number);
    get distance(): number;
    set distance(value: number);
    /** The "right" vector coming directly from the matrix. */
    get mRight(): any;
    /** The "up" vector coming directly from the matrix. */
    get mUp(): any;
    /** The "forward" vector coming directly from the matrix. */
    get mForward(): any;
}
export {};

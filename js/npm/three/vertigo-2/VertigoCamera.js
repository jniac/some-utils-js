import { Euler, Matrix4, PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { lerp, clamp } from 'three/src/math/MathUtils';
const PERSPECTIVE_ONE = .8;
const _vector = new Vector3();
const _matrix = new Matrix4();
const _quaternion = new Quaternion();
function setupVector(args) {
    if (args[0] instanceof Vector3) {
        _vector.copy(args[0]);
        _vector.multiplyScalar(args[1]?.scalar ?? 1);
    }
    else {
        _vector.set(args[0], args[1] ?? 0, args[2] ?? 0);
        _vector.multiplyScalar(args[3]?.scalar ?? 1);
    }
    return _vector;
}
const defaultHeight = 4;
const defaultOptions = {
    heightMin: .01,
    heightMax: 10000,
    rangeMin: -1000,
    rangeMax: 1000,
    nearMin: .01,
    farMax: 1e5,
    fovEpsilon: 1 * Math.PI / 180,
};
export const updateVertigoCamera = (camera, focusPosition, height, aspect, rangeMin = defaultOptions.rangeMin, rangeMax = defaultOptions.rangeMax, nearMin = defaultOptions.nearMin, farMax = defaultOptions.farMax, fovEpsilon = defaultOptions.fovEpsilon) => {
    // NOTE: In ThreeJS "fov" is in degree.
    const fov = camera.fov * Math.PI / 180;
    const isPerspective = fov > fovEpsilon;
    const distance = isPerspective ? height / 2 / Math.tan(fov / 2) : -rangeMin;
    // 1. Position, rotation & matrix.
    camera.quaternion.setFromEuler(camera.rotation);
    _matrix.makeRotationFromQuaternion(camera.quaternion);
    _vector.set(0, 0, distance).applyMatrix4(_matrix);
    camera.position.addVectors(focusPosition, _vector);
    camera.matrixAutoUpdate = false;
    camera.updateMatrix();
    camera.updateMatrixWorld(true);
    // 2. Near, far & projection.
    const near = Math.max(nearMin, distance + rangeMin);
    const far = Math.min(farMax, distance + rangeMax);
    if (isPerspective) {
        // https://github.com/mrdoob/three.js/blob/master/src/cameras/PerspectiveCamera.js#L179
        const mHeight = height * near / distance * .5;
        const mWidth = mHeight * aspect;
        camera.projectionMatrix.makePerspective(-mWidth, mWidth, mHeight, -mHeight, near, far);
    }
    else {
        const mHeight = height * .5;
        const mWidth = mHeight * aspect;
        camera.projectionMatrix.makeOrthographic(-mWidth, mWidth, mHeight, -mHeight, near, far);
    }
    camera.near = near;
    camera.far = far;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    // 3. Three internals.
    // @ts-ignore
    camera.isPerspectiveCamera = isPerspective;
    // @ts-ignore
    camera.isOrthographicCamera = !isPerspective;
};
export class VertigoCamera extends PerspectiveCamera {
    #height = defaultHeight;
    #heightMin = defaultOptions.heightMin;
    #heightMax = defaultOptions.heightMax;
    rangeMin = defaultOptions.rangeMin;
    rangeMax = defaultOptions.rangeMax;
    nearMin = defaultOptions.nearMin;
    farMax = defaultOptions.farMax;
    fovEpsilon = defaultOptions.fovEpsilon;
    focusPosition = new Vector3();
    setHeight(value) {
        this.#height = clamp(value, this.#heightMin, this.heightMax);
    }
    setHeightMin(value) {
        this.#heightMin = value;
        this.#height = clamp(this.#height, this.#heightMin, this.heightMax);
    }
    setHeightMax(value) {
        this.#heightMax = value;
        this.#height = clamp(this.#height, this.#heightMin, this.heightMax);
    }
    get height() { return this.#height; }
    get heightMin() { return this.#heightMin; }
    get heightMax() { return this.#heightMax; }
    set height(value) { this.setHeight(value); }
    set heightMin(value) { this.setHeightMin(value); }
    set heightMax(value) { this.setHeightMax(value); }
    // Cache takes some lines:
    #cache = {
        height: 0,
        heightMin: 0,
        heightMax: 0,
        fov: 0,
        focusPosition: new Vector3(),
        position: new Vector3(),
        rotation: new Euler(),
        rangeMin: 0,
        rangeMax: 0,
        nearMin: 0,
        farMax: 0,
        fovEpsilon: 0,
    };
    #cacheChanges = {
        height: false,
        heightMin: false,
        heightMax: false,
        fov: false,
        focusPosition: false,
        position: false,
        rotation: false,
        rangeMin: false,
        rangeMax: false,
        nearMin: false,
        farMax: false,
        fovEpsilon: false,
    };
    #computeCacheChanges() {
        const cache = this.#cache;
        const changed = this.#cacheChanges;
        changed.height = cache.height !== this.height;
        changed.heightMin = cache.heightMin !== this.heightMin;
        changed.heightMax = cache.heightMax !== this.heightMax;
        changed.fov = cache.fov !== this.fov;
        changed.focusPosition = !cache.focusPosition.equals(this.focusPosition);
        changed.position = !cache.position.equals(this.position);
        changed.rotation = !cache.rotation.equals(this.rotation);
        changed.rangeMin = cache.rangeMin !== this.rangeMin;
        changed.rangeMax = cache.rangeMax !== this.rangeMax;
        changed.nearMin = cache.nearMin !== this.nearMin;
        changed.farMax = cache.farMax !== this.farMax;
        changed.fovEpsilon = cache.fovEpsilon !== this.fovEpsilon;
        return (changed.height
            || changed.heightMin
            || changed.heightMax
            || changed.fov
            || changed.focusPosition
            || changed.position
            || changed.rotation
            || changed.rangeMin
            || changed.rangeMax
            || changed.nearMin
            || changed.farMax
            || changed.fovEpsilon);
    }
    #updateCache() {
        const cache = this.#cache;
        cache.height = this.height;
        cache.heightMin = this.heightMin;
        cache.heightMax = this.heightMax;
        cache.fov = this.fov;
        cache.focusPosition.copy(this.focusPosition);
        cache.position.copy(this.position);
        cache.rotation.copy(this.rotation);
        cache.rangeMin = this.rangeMin;
        cache.rangeMax = this.rangeMax;
        cache.nearMin = this.nearMin;
        cache.farMax = this.farMax;
        cache.fovEpsilon = this.fovEpsilon;
    }
    updateVertigoCamera() {
        updateVertigoCamera(this, this.focusPosition, this.height, this.aspect, this.rangeMin, this.rangeMax, this.nearMin, this.farMax, this.fovEpsilon);
        this.#updateCache();
    }
    throwNaN() {
        if (Number.isNaN(this.height)) {
            throw new Error(`"height" is NaN!`);
        }
        if (Number.isNaN(this.focusPosition.x) || Number.isNaN(this.focusPosition.y) || Number.isNaN(this.focusPosition.z)) {
            throw new Error(`"focusPosition.x|y|z" is NaN!`);
        }
        if (Number.isNaN(this.position.x) || Number.isNaN(this.position.y) || Number.isNaN(this.position.z)) {
            throw new Error(`"position.x|y|z" is NaN!`);
        }
    }
    update() {
        this.throwNaN();
        const dirty = this.#computeCacheChanges();
        if (dirty) {
            // If "position" changes, compute the resulting "focus position" changes.
            if (this.#cacheChanges.position) {
                _vector.subVectors(this.position, this.#cache.position);
                this.focusPosition.add(_vector);
            }
            this.updateVertigoCamera();
        }
    }
    constructor() {
        super(PERSPECTIVE_ONE * 180 / Math.PI);
        this.updateVertigoCamera();
        // Set the good rotation order (first around Y, then X (front/back), then Z (screen rotation))
        this.rotation.order = 'YXZ';
        // break the "quaternion-to-euler" callback
        this.quaternion._onChangeCallback = () => { };
    }
    getSerializedProps() {
        const { aspect, fov, fovEpsilon, height, heightMin, heightMax, rangeMin, rangeMax, nearMin, farMax, focusPosition: { x: focusPositionX, y: focusPositionY, z: focusPositionZ }, rotation: { x: rotationX, y: rotationY, z: rotationZ }, } = this;
        return {
            aspect,
            fov,
            fovEpsilon,
            height,
            heightMin,
            heightMax,
            rangeMin,
            rangeMax,
            nearMin,
            farMax,
            focusPositionX,
            focusPositionY,
            focusPositionZ,
            rotationX,
            rotationY,
            rotationZ,
        };
    }
    setSerializedProps({ aspect = this.aspect, fov = this.fov, fovEpsilon = this.fovEpsilon, height = this.height, heightMin = this.heightMin, heightMax = this.heightMax, rangeMin = this.rangeMin, rangeMax = this.rangeMax, nearMin = this.nearMin, farMax = this.farMax, focusPositionX = this.focusPosition.x, focusPositionY = this.focusPosition.y, focusPositionZ = this.focusPosition.z, rotationX = this.rotation.x, rotationY = this.rotation.y, rotationZ = this.rotation.z, }) {
        this.aspect = aspect;
        this.fov = fov;
        this.fovEpsilon = fovEpsilon;
        this.height = height;
        this.heightMin = heightMin;
        this.heightMax = heightMax;
        this.rangeMin = rangeMin;
        this.rangeMax = rangeMax;
        this.nearMin = nearMin;
        this.farMax = farMax;
        this.focusPosition.set(focusPositionX, focusPositionY, focusPositionZ);
        this.rotation.set(rotationX, rotationY, rotationZ);
    }
    copy(other) {
        super.copy(other);
        this.height = other.height;
        this.heightMin = other.heightMin;
        this.heightMax = other.heightMax;
        this.rangeMin = other.rangeMin;
        this.rangeMax = other.rangeMax;
        this.nearMin = other.nearMin;
        this.farMax = other.farMax;
        this.fovEpsilon = other.fovEpsilon;
        this.focusPosition.copy(other.focusPosition);
        this.rotation.x = other.rotation.x;
        this.rotation.y = other.rotation.y;
        this.rotation.z = other.rotation.z;
        this.#updateCache();
        return this;
    }
    clone() {
        return new VertigoCamera().copy(this);
    }
    lerpCameras(a, b, alpha) {
        // Fundamental props.
        this.height = lerp(a.height, b.height, alpha);
        this.fov = lerp(a.fov, b.fov, alpha);
        this.fovEpsilon = lerp(a.fovEpsilon, b.fovEpsilon, alpha);
        this.focusPosition.lerpVectors(a.focusPosition, b.focusPosition, alpha);
        // NOTE: rotation is interpolated through quaternions
        _quaternion.slerpQuaternions(a.quaternion, b.quaternion, alpha);
        this.rotation.setFromQuaternion(_quaternion);
        // Secondary props.
        this.rangeMin = lerp(a.rangeMin, b.rangeMin, alpha);
        this.rangeMax = lerp(a.rangeMax, b.rangeMax, alpha);
        this.nearMin = lerp(a.nearMin, b.nearMin, alpha);
        this.farMax = lerp(a.farMax, b.farMax, alpha);
        this.update();
        return this;
    }
    lerp(other, alpha) {
        return this.lerpCameras(this, other, alpha);
    }
    move(...args) {
        const { x, y, z } = setupVector(args);
        const position = this.position, me = this.matrix.elements;
        position.x += me[0] * x;
        position.y += me[1] * x;
        position.z += me[2] * x;
        position.x += me[4] * y;
        position.y += me[5] * y;
        position.z += me[6] * y;
        position.x += me[8] * z;
        position.y += me[9] * z;
        position.z += me[10] * z;
        return this;
    }
    /**
     * Adjust the focusPosition to keep a constant distance with an hypothetic target.
     * @param signedDistance The current distance (signed distance).
     * @param desiredDistance The desired distance.
     */
    maintainDistance(signedDistance, desiredDistance) {
        const deltaZ = desiredDistance - signedDistance;
        return this.move(0, 0, deltaZ);
    }
    /**
     * Change the current height, and the focus position to make a "zoom" effect.
     * @param height The new height value.
     * @param screenPoint Screen point (NDC coordinates).
     */
    applyHeight(height, { x = 0, y = 0 } = {}) {
        const oldHeight = this.#height;
        this.setHeight(height);
        const deltaHeight = (this.height - oldHeight) * -.5;
        if (deltaHeight !== 0) {
            const dy = deltaHeight * y;
            const dx = deltaHeight * this.aspect * x;
            const me = this.matrix.elements;
            const rx = me[0], ry = me[1], rz = me[2];
            const ux = me[4], uy = me[5], uz = me[6];
            this.focusPosition.x += dx * rx + dy * ux;
            this.focusPosition.y += dx * ry + dy * uy;
            this.focusPosition.z += dx * rz + dy * uz;
            this.throwNaN();
        }
        return this;
    }
    applyZoom(ratio, { x = 0, y = 0 } = {}) {
        this.applyHeight(this.#height * ratio, { x, y });
        return this;
    }
    getDistance() {
        const fov = this.fov * Math.PI / 180;
        const isPerspective = fov > this.fovEpsilon;
        return isPerspective ? this.height * .5 / Math.tan(fov * .5) : -this.rangeMin;
    }
    /**
     * NOTE: Not sure of this function. Does it do what it should do?
     */
    setDistance(value) {
        if (value <= 0) {
            throw new Error(`Invalid value (${value}).`);
        }
        const fov = this.fov * Math.PI / 180;
        const isPerspective = fov > this.fovEpsilon;
        const me = this.matrix.elements;
        const fx = me[8], fy = me[9], fz = me[10];
        const tx = me[12], ty = me[13], tz = me[14];
        this.focusPosition.set(tx - fx * value, ty - fy * value, tz - fz * value);
        if (isPerspective) {
            // Compensate height with the new focus position (in perspective only).
            this.height = Math.tan(fov * .5) * value * 2;
        }
        this.throwNaN();
    }
    // Some sugar?
    // Here it is:
    get perspective() {
        return this.fov * Math.PI / 180 / PERSPECTIVE_ONE;
    }
    set perspective(value) {
        this.fov = value * PERSPECTIVE_ONE * 180 / Math.PI;
    }
    get distance() {
        return this.getDistance();
    }
    set distance(value) {
        this.setDistance(value);
    }
    /** The "right" vector coming directly from the matrix. */
    get mRight() {
        const me = this.matrix.elements;
        const x = me[0], y = me[1], z = me[2];
        return new Vector3(x, y, z);
    }
    /** The "up" vector coming directly from the matrix. */
    get mUp() {
        const me = this.matrix.elements;
        const x = me[4], y = me[5], z = me[6];
        return new Vector3(x, y, z);
    }
    /** The "forward" vector coming directly from the matrix. */
    get mForward() {
        const me = this.matrix.elements;
        const x = me[8], y = me[9], z = me[10];
        return new Vector3(x, y, z);
    }
}

import { PerspectiveCamera } from 'three';
export declare class VertigoCamera extends PerspectiveCamera {
    #private;
    get perspective(): number;
    set perspective(perspective: number);
    get isPerspective(): boolean;
    get height(): number;
    set height(height: number);
    get range(): number;
    set range(range: number);
    get distance(): number;
    set distance(distance: number);
    focalPoint: any;
    setRotation({ useDegree, x, y, z, }: {
        useDegree: boolean;
        x?: number;
        y?: number;
        z?: number;
    }): this;
    constructor({ height, range, distance, perspective, aspect, rotationOrder, }?: {
        height?: number | undefined;
        range?: number | undefined;
        distance?: number | undefined;
        perspective?: number | undefined;
        aspect?: number | undefined;
        rotationOrder?: any;
    });
    setVertigo({ perspective, height, distance, range, }: {
        perspective?: number | undefined;
        height?: number | undefined;
        distance?: number | undefined;
        range?: number | undefined;
    }): void;
    updateQuaternion(): this;
    updateProjection(): void;
    updateMatrix(): void;
    updatePositionRotation(): void;
}

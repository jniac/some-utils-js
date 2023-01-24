import { EulerOrder, Quaternion } from 'three';
export type TransformParams = Partial<{
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    /** Specify directly the quaternion (instead of using euler rotation). */
    q: Quaternion;
    rotationOrder: EulerOrder;
    useDegree: boolean;
    s: number;
    sx: number;
    sy: number;
    sz: number;
}>;
export declare const getGeometryTransformer: ({ defaultRotationOrder, defaultUseDegree, }?: {
    defaultRotationOrder?: any;
    defaultUseDegree?: boolean | undefined;
}) => {
    transform: (geometry: BufferGeometry, transformParams: TransformParams) => BufferGeometry;
};

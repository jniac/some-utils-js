import * as THREE from 'three';
import { EulerOrder } from 'three';
export type TransformArg = Partial<{
    positionX: number;
    positionY: number;
    positionZ: number;
    position: THREE.Vector3;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    rotationOrder: EulerOrder;
    rotation: THREE.Euler;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    scaleScalar: number;
    scale: THREE.Vector3;
    visible: boolean;
    parent: THREE.Object3D;
}>;
export declare const applyTransform: <T extends THREE.Object3D>(target: T, { positionX, positionY, positionZ, position, rotationX, rotationY, rotationZ, rotationOrder, rotation, scaleX, scaleY, scaleZ, scaleScalar, scale, visible, parent, }: TransformArg) => T;
export declare const createGroup: (props: TransformArg) => any;
export type MeshArg = TransformArg & Partial<{
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    receiveShadow: boolean;
    castShadow: boolean;
}>;
export declare const createMesh: ({ geometry, material, receiveShadow, castShadow, ...props }: MeshArg) => any;

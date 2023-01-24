import { ShaderMaterialParameters, Vector3 } from 'three';
import { ColorArg } from './helper-config';
export type CreateSingleAxeGeometryOptions = Partial<{
    axis: 'x' | 'y' | 'z';
    length: number;
    color: ColorArg;
    radius: number;
    radiusScale: number;
}>;
/**
 * Create axes geometry: 3 arrow X, Y, Z with vertex colors.
 */
export declare const createSingleAxeGeometry: ({ axis, length, color, radius, radiusScale, }?: CreateSingleAxeGeometryOptions) => any;
export type CreateAxesGeometryOptions = Partial<{
    color: ColorArg;
    colorX: ColorArg;
    colorY: ColorArg;
    colorZ: ColorArg;
    radius: number;
    radiusScale: number;
    alignMode: 'positive' | 'center' | 'negative';
}>;
/**
 * Create axes geometry: 3 arrow X, Y, Z with vertex colors.
 */
export declare const createAxesGeometry: ({ color, colorX, colorY, colorZ, radius, radiusScale, alignMode, }?: CreateAxesGeometryOptions) => any;
export declare const createAxesMaterial: ({ uniforms, opacity, lightPosition, flatShading, ...props }?: Partial<{
    lightPosition: Vector3;
    flatShading: number;
}> & Omit<ShaderMaterialParameters, "vertexShader" | "fragmentShader">) => any;

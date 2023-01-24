// @ts-ignore (ignore none-existing module, of course if module does not exist this file should not be imported)
import * as THREE from 'three';
import { radian } from '../../math.js';
export const applyTransform = (target, { positionX = 0, positionY = 0, positionZ = 0, position = new THREE.Vector3(positionX, positionY, positionZ), rotationX = 0, rotationY = 0, rotationZ = 0, rotationOrder = 'XYZ', rotation = new THREE.Euler(radian(rotationX), radian(rotationY), radian(rotationZ), rotationOrder), scaleX = 1, scaleY = 1, scaleZ = 1, scaleScalar = 1, scale = new THREE.Vector3(scaleX * scaleScalar, scaleY * scaleScalar, scaleZ * scaleScalar), visible = true, parent, }) => {
    target.position.copy(position);
    target.rotation.copy(rotation);
    target.scale.copy(scale);
    target.visible = visible;
    parent?.add(target);
    return target;
};
export const createGroup = (props) => {
    return applyTransform(new THREE.Group(), props);
};
export const createMesh = ({ geometry = new THREE.BoxGeometry(1, 1, 1), material = new THREE.MeshPhysicalMaterial({ color: 'red' }), receiveShadow = false, castShadow = false, ...props }) => {
    const mesh = new THREE.Mesh(geometry, material);
    Object.assign(mesh, {
        receiveShadow,
        castShadow,
    });
    return applyTransform(mesh, props);
};

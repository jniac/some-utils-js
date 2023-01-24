import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
export const getGeometryTransformer = ({ defaultRotationOrder = 'XYZ', defaultUseDegree = true, } = {}) => {
    // internal, intermediate values
    const _e = new Euler();
    const _p = new Vector3();
    const _r = new Quaternion();
    const _s = new Vector3();
    const _m = new Matrix4();
    const setMatrix = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, rotationOrder = defaultRotationOrder, useDegree = defaultUseDegree, q = undefined, s = 1, sx = 1, sy = 1, sz = 1, }) => {
        const a = useDegree ? Math.PI / 180 : 1;
        if (q) {
            _r.copy(q);
        }
        else {
            _r.setFromEuler(_e.set(rx * a, ry * a, rz * a, rotationOrder));
        }
        _p.set(x, y, z);
        _s.set(s * sx, s * sy, s * sz);
        _m.identity().compose(_p, _r, _s);
    };
    const transformPosition = (attribute) => {
        const max = attribute.count;
        for (let i = 0; i < max; i++) {
            _p.set(attribute.getX(i), attribute.getY(i), attribute.getZ(i));
            _p.applyMatrix4(_m);
            attribute.setXYZ(i, _p.x, _p.y, _p.z);
        }
    };
    const transformNormal = (attribute) => {
        _m.setPosition(0, 0, 0);
        const max = attribute.count;
        for (let i = 0; i < max; i++) {
            _p.set(attribute.getX(i), attribute.getY(i), attribute.getZ(i));
            _p.applyMatrix4(_m);
            attribute.setXYZ(i, _p.x, _p.y, _p.z);
        }
    };
    const transform = (geometry, transformParams) => {
        setMatrix(transformParams);
        transformPosition(geometry.attributes.position);
        transformNormal(geometry.attributes.normal);
        return geometry;
    };
    return { transform };
};

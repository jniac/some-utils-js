export const dotProduct = (ux, uy, vx, vy) => ux * vx + uy * vy;
export const euclideanDistance2D = (x, y) => Math.sqrt(x * x + y * y);
export const euclideanDistance3D = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
export const euclideanDistance = (...numbers) => {
    let sum = 0;
    for (const x of numbers) {
        sum += x * x;
    }
    return Math.sqrt(sum);
};

/**
 * "Unflats" the given array: from one flattened array, it returns an array of
 * array of the given length.
 */
export const divideArray = (array, size) => {
    const max = Math.ceil(array.length / size);
    const result = new Array(max);
    for (let i = 0; i < max; i++) {
        const chunk = new Array(size);
        for (let j = 0; j < size; j++) {
            chunk[j] = array[i * size + j];
        }
        result[i] = chunk;
    }
    return result;
};
export { divideArray as unflat };

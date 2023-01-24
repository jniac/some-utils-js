function getItem(key, defaultValue) {
    const value = localStorage.getItem(key);
    return value === null ? defaultValue ?? null : JSON.parse(value);
}
function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export const jsonLocalStorage = {
    getItem,
    setItem,
};

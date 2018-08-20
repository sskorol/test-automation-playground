export function isDouble(val) {
    const offset = Math.abs(Math.fround(val) - val);
    return !isNaN(offset) && offset > 0;
}

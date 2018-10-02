export function isNumber(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value === 'number') {
        return true;
    }
    return !isNaN(parseFloat(value)) && !isNaN(value - 0);
}

export function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

export function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isBoolean(value) {
    return typeof value === 'boolean';
}
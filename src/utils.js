export const promiseResolve = Promise.resolve.bind(Promise);
export const promiseReject = Promise.reject.bind(Promise);
const toTypeString = Object.prototype.toString;
export function valueOf(tar) {
    return toTypeString.call(tar).slice(8, -1);
}
const hasInType = (target, type) => type === valueOf(target);
export function isObject(tar) {
    return hasInType(tar, "Object");
}
export function isFunction(tar) {
    return tar instanceof Function;
}
export function isStream(tar) {
    return isObject(tar) && typeof isFunction(tar.pipe);
}
export function isArray(tar) {
    return Array.isArray(tar);
}
export const isNode = typeof process !== "undefined" && valueOf(process) === "process";
export function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
export function isUndef(tar) {
    return tar === null || tar === undefined;
}
/**
 *
 * @param tar any
 * @returns boolean
 * @description null undefined length size size() keys
 */
export function isEmpty(tar) {
    if (isUndef(tar)) {
        return true;
    }
    if (Number.isInteger(tar.length)) {
        return tar.length === 0;
    }
    if ("size" in tar) {
        return isFunction(tar.size) ? tar.size() === 0 : tar.size === 0;
    }
    if ("byteLength" in tar) {
        return tar.byteLength === 0;
    }
    if (isFunction(tar.keys)) {
        return tar.keys().length === 0;
    }
    return Object.keys(tar).length === 0;
}
export function encode(input) {
    try {
        return encodeURIComponent(input)
            .replace(/%3A/gi, ":")
            .replace(/%24/g, "$")
            .replace(/%2C/gi, ",")
            .replace(/%20/g, "+")
            .replace(/%5B/gi, "[")
            .replace(/%5D/gi, "]");
    }
    catch (e) {
        console.error(input.toString() + e);
        return input.toString();
    }
}
export function forEach(target, each) {
    if (target === null || target === undefined) {
        return;
    }
    if ("forEach" in target) {
        return target.forEach(each);
    }
    if (isObject(target)) {
        return Object.entries(target).forEach(([key, value]) => each(key, value));
    }
    for (let [key, val] of target) {
        each(key, val);
    }
}
export function copyTo(source, target) {
    forEach(source, function each(key, val) {
        target[key] = val;
    });
}

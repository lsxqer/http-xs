import { isObject } from "../utils";
export const defaultContentType = {
    contentType: "Content-Type",
    search: "application/x-www-form-urlencoded; charset=UTF-8",
    json: "application/json; charset=UTF-8",
    text: "text/plain;charset=UTF-8"
};
/**
 * 将`content-type` 转换为 `Content-Type`
 * @param name key
 * @returns key
 */
export function toCamelCase(name) {
    if (typeof name !== "string") {
        name = name.toString();
    }
    let nextKey = name.charAt(0).toUpperCase();
    let prev = nextKey;
    for (let i = 1; i < name.length; i++) {
        let el = name.charAt(i).toLowerCase();
        if (prev === "-") {
            el = el.toUpperCase();
        }
        nextKey += el;
        prev = el;
    }
    return nextKey;
}
export class XsHeaders extends URLSearchParams {
    constructor(init) {
        let initialize = [];
        if (init instanceof XsHeaders) {
            // ~ return this.raw;
            init = init.raw();
        }
        if (isObject(init)) {
            init = Array.from(Object.entries(init));
        }
        if (Array.isArray(init)) {
            init.forEach(function each([key, val]) { initialize.push([toCamelCase(key), val]); });
        }
        super(initialize);
    }
    toString() {
        return Object.prototype.toString.call(this);
    }
    get [Symbol.toStringTag]() {
        return "XsHeaders";
    }
    raw() {
        let ans = {};
        super.forEach(function each(val, key) {
            ans[key] = val;
        });
        return ans;
    }
    get(name) {
        let ans = super.get(toCamelCase(name));
        return ans !== null && ans !== void 0 ? ans : null;
    }
    set(name, value) {
        return super.set(toCamelCase(name), value);
    }
    append(name, value) {
        return super.append(toCamelCase(name), value);
    }
    has(name) {
        return super.has(toCamelCase(name));
    }
    delete(name) {
        return super.delete(toCamelCase(name));
    }
    forEach(callbackfn, thisArg) {
        return super.forEach(callbackfn, thisArg);
    }
}
export default XsHeaders;

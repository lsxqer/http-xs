import { isObject } from "../utils";
import { XsHeaderImpl } from "../typedef";

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
export function toCamelCase(name: string): string {

  if (typeof name !== "string") {
    name = (name as unknown).toString();
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


export class XsHeaders extends URLSearchParams implements XsHeaderImpl {

  constructor(init?: Record<string, string> | [string, string][] | XsHeaderImpl) {
    let initialize = [] as [string, string][];


    if (init instanceof XsHeaders) {
      // ~ return this.raw;
      init = init.raw();
    }

    if (isObject(init)) {
      init = Array.from(Object.entries(init));
    }
    if (Array.isArray(init)) {
      (init as [string, string][]).forEach(([ key, val ]) => initialize.push([ toCamelCase(key), val ]));
    }

    super(initialize);
  }

  toString(): string {
    return Object.prototype.toString.call(this);
  }

  get [Symbol.toStringTag]() {
    return "XsHeaders";
  }

  raw(): Record<string, string> {
    let ans = {};
    super.forEach((val, key) => {
      ans[key] = val;
    });
    return ans;
  }

  get(name: string) {
    let ans = super.get(toCamelCase(name));
    return ans ?? null;
  }

  set(name: string, value: string) {
    return super.set(toCamelCase(name), value);
  }

  append(name: string, value: string) {
    return super.append(toCamelCase(name), value);
  }

  has(name: string) {
    return super.has(toCamelCase(name));
  }

  delete(name: string) {
    return super.delete(toCamelCase(name));
  }

  forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void {
    return super.forEach(callbackfn, thisArg);
  }

}

export default XsHeaders;

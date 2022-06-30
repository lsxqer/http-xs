import { isNil, isObject, valueOf } from "./utils";
import { XsHeaderImpl } from "./typedef";

export const contentType = {
  contentType: "Content-Type",
  search: "application/x-www-form-urlencoded; charset=UTF-8",
  json: "application/json; charset=UTF-8",
  text: "text/plain; charset=UTF-8",
  isJSON(src?: string) {
    return src?.includes("application/json");
  }
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

    let initialize: Record<string, string> = {};

    XsHeaders.forEach(init, (k, v) => {
      initialize[k] = v;
    });

    super(initialize);
  }

  static forEach(init: Record<string, string> | [string, string][] | XsHeaderImpl, each: (key: string, val: string) => void) {
    if (isNil(init)) {
      return;
    }

    if (valueOf(init) === "Headers" || init instanceof XsHeaders) {
      (init as XsHeaderImpl).forEach((v, k) => each(toCamelCase(k), v));
      return;
    }
    if (isObject(init)) {
      init = Object.entries(init);
    }

    if (typeof init?.forEach === "function") {
      (init as Array<[string, string]>).forEach(([ k, v ]) => {
        each(toCamelCase(k), v);
      });
    }
  }

  toString(): string {
    return Object.prototype.toString.call(this);
  }

  get [Symbol.toStringTag]() {
    return "XsHeaders";
  }

  *[Symbol.iterator]() {
    for (let el of Object.entries(this.raw())) {
      yield el;
    }
  }

  raw(): Record<string, string> {
    let ans = {};
    super.forEach(function each(val, key) {
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

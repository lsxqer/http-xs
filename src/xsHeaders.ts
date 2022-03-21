import { XsHeaderImpl } from "./typedef";
import { forEach, isArray, isObject } from "./utils";

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


export class XsHeaders extends URLSearchParams {

  constructor(defaultRecord?: Record<string, string> | [string, string][]) {
    super();

    if (isArray(defaultRecord)) {
      defaultRecord.forEach(kv => {
        this.set(kv.shift(), kv.pop());
      });
    }
    else if (isObject(defaultRecord)) {
      forEach(defaultRecord, (key, val) => this.set(key, val));
    }

  }

  static from(defaultRecord?: Record<string, string> | [string, string][] | XsHeaderImpl) {

    if (typeof Headers !== "undefined" && defaultRecord instanceof Headers) {
      let xsHeader = new XsHeaders();
      defaultRecord.forEach((val, key) => {
        xsHeader.set(key, val);
      });
      return xsHeader;
    }

    return new XsHeaders(defaultRecord as Record<string, string> | [string, string][]);
  }

  toString() {
    return Object.prototype.toString.call(this);
  }

  get [Symbol.toStringTag]() {
    return "XsHeaders";
  }

  toJSON() {
    return this.raw();
  }

  raw(): Record<string, string> {
    let res = {};
    this.forEach((val, key) => {
      res[key] = val;
    });
    return res;
  }

  get(name: string) {
    let val = super.get(toCamelCase(name));
    if (val === undefined) {
      return null;
    }
    return val;
  }

  set(name: string, value: string) {
    super.set(toCamelCase(name), value);
  }

  append(name: string, value: string) {
    super.append(toCamelCase(name), value);
  }

  has(name: string) {
    return super.has(toCamelCase(name));
  }

  delete(name: string) {
    super.delete(toCamelCase(name));
  }

  forEach(callback: (val: string, key: string, parent?: any) => void, thisArg?: any) {
    super.forEach(callback, thisArg);
  }

}


// export function createAutoHeader() {

// }
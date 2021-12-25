import { forEach, isArray, isObject } from "./utils";
import { XsHeaderImpl } from "./types";


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


/**
 * 可以运行在浏览器和node环境中
 * 拥有和原生header相同的方法
 */
export class XsHeaders extends URLSearchParams implements XsHeaderImpl {

  constructor(initRecord?: Record<string, string> | [string, string][]) {
    super();
    forEach(initRecord, (key, val) => {
      if (isArray(key)) {
        this.set(key[0], key[1]);
      } else {
        this.set(key, val);
      }
    });
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


export function createXsHeader(head?: Record<string, string> | [string, string][] | Headers | XsHeaderImpl, force = false): XsHeaderImpl {
  let isHeadUndef = typeof Headers === "undefined";

  if (!force) {
    if ((!isHeadUndef && head instanceof Headers) || head instanceof XsHeaders) {
      return head;
    }
  }

  if (force) {
    if (head instanceof XsHeaders) {
      let xsHeader = new XsHeaders();
      head.forEach((val, key) => {
        xsHeader.set(key, val);
      });
      return xsHeader;
    }
    if (isObject(head) || isArray(head)) {
      return new XsHeaders(head);
    }
  }

  let nextHeader;
  if (!isHeadUndef) {
    nextHeader = new Headers();
    forEach(head, (key, val) => {
      if (isArray(key)) {
        nextHeader.set(toCamelCase(key[0]), key[1]);
      } else {
        nextHeader.set(toCamelCase(key), val);
      }
    });
  } else {
    nextHeader = new XsHeaders(head as Record<string, string> | [string, string][]);
  }

  return nextHeader;
}

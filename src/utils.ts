
export const promiseResolve = Promise.resolve.bind(Promise);

export const promiseReject = Promise.reject.bind(Promise);


const toString = Object.prototype.toString;

export const getType = (tar: unknown): string => toString.call(tar).slice(8, -1);
const hasInType = <T>(target: unknown, type: string): target is T => type === getType(target);

export function isObject<T = Record<string, unknown>>(tar: unknown): tar is T {
  return hasInType<T>(tar, "Object");
}

export function isStream(tar: any) {
  return isObject(tar) && typeof tar.pipe === "function";
}

export function isArray<R = any, T extends Array<R> = Array<R>>(tar: unknown): tar is T {
  return Array.isArray(tar);
}

export const isNode = typeof process !== "undefined" && getType(process) === "process";

export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


export function isUndef<T>(tar: T): tar is null {
  return tar === null || tar === undefined;
}

/**
 *
 * @param tar any
 * @returns boolean
 * @description null undefined length size size() keys
 */
 export function isEmpty(tar: any): boolean {
  if (isUndef(tar)) {
    return true;
  }
  if (Number.isInteger(tar.length)) {
    return tar.length === 0;
  }
  if ("size" in tar) {
    return typeof tar.size === "function" ? tar.size() === 0 : tar.size === 0;
  }
  if ("byteLength" in tar) {
    return tar.byteLength === 0;
  }
  if (typeof tar.keys === "function") {
    return tar.keys().length === 0;
  }
  return Object.keys(tar).length === 0;
}

export function encode(input: string | number | boolean): string {
  try {
    return encodeURIComponent(input)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  } catch (e) {
    console.error(input.toString() + e);
    return input.toString();
  }
}


export function forEach<T = any>(target: any, each: (key: string, val: T) => void): void {
  if (target === null || target === undefined) {
    return;
  }
  if ("forEach" in target) {
    return target.forEach(each);
  }
  if (isObject(target)) {
    return Object.entries(target).forEach(([ key, value ]) => each(key, value as T));
  }
  for (let [ key, val ] of target as { [Symbol.iterator]() }) {
    each(key, val);
  }
}

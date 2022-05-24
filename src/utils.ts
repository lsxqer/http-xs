
export const asyncResolve = Promise.resolve.bind(Promise);
export const asyncReject = Promise.reject.bind(Promise);


const toTypeString = Object.prototype.toString;

export function valueOf(tar: unknown): string {
  return toTypeString.call(tar).slice(8, -1);
}

const hasInType = <T>(target: unknown, type: string): target is T => type === valueOf(target);

export function isObject<T = Record<string, unknown>>(tar: unknown): tar is T {
  return hasInType<T>(tar, "Object");
}

export function isFunction<T = (...args: any[]) => void>(tar: unknown): tar is T {
  return typeof tar === "function";
}

export function isStream(tar: any) {
  return isObject(tar) && typeof isFunction(tar.pipe);
}

export function isArray<R = any, T extends Array<R> = Array<R>>(tar: unknown): tar is T {
  return Array.isArray(tar);
}

export const isNode = typeof process !== "undefined" && valueOf(process) === "process";

export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


export function isNil<T>(tar: T): tar is null {
  return tar === null || tar === undefined;
}

/**
 *
 * @param tar any
 * @returns boolean
 * @description null undefined length size size() keys
 */
export function isEmpty(tar: any): boolean {
  if (isNil(tar)) {
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


export function forEach<T extends Record<string, unknown> | Array<unknown> = any, K extends keyof T = keyof T>(target: any, each: (key: K, val: T[K]) => void): void {
  if (target === null || target === undefined) {
    return;
  }
  if ("forEach" in target) {
    return target.forEach(each);
  }
  if (isObject(target)) {
    return Object.entries(target).forEach(([ key, value ]) => each(key as K, value as T[K]));
  }

  for (let [ key, val ] of target as { [Symbol.iterator]() }) {
    each(key, val);
  }

}


export function copyTo(source, target) {
  forEach(source, function each(key, val) {
    target[key] = val;
  });
}
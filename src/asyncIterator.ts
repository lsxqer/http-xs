
import type { ResponseStruct, PromiseFunction } from "./typedef";

function executionRequest<T>(fn: PromiseFunction<T>, complete: (res: T) => void) {
  return fn().then(complete, complete);
}

export function asyncIterable<K = any, R = ResponseStruct, T = Map<K, PromiseFunction<R>>>(iterator: T, map?: (res: R) => R): Promise<Map<K, R>>;
export function asyncIterable<K extends string | number = string | number, R = ResponseStruct, T = Record<K, PromiseFunction<R>>>(iterator: T, map?: (res: R) => R): Promise<Record<K, R>>;
export function asyncIterable<R = ResponseStruct, K = Array<PromiseFunction<R>>>(iterator: K, map?: (res: R) => R): Promise<Array<R>>;
export async function asyncIterable<R = ResponseStruct | Error>(iterator, map) {

  if (iterator instanceof Map) {
    let promiseResult = iterator;

    return new Promise(function executor(res) {
      let i = 0, len = iterator.size;
      iterator.forEach(function each(fn, key) {
        executionRequest<R>(
          fn,
          function onCompleate(result) {
            promiseResult.set(key, typeof map === "function" ? map(result) : result);
            i++;
            if (i === len) {
              res(promiseResult);
            }
          });
      });
    });
  }

  let promiseResult = iterator;

  return new Promise(function executor(res) {
    let keys = Array.from(Object.keys(iterator));
    let i = 0, len = keys.length;

    while (i < len) {
      i++;
      executionRequest<R>(
        iterator[keys[i]],
        function onCompleate(result) {
          promiseResult[keys[i]] = typeof map === "function" ? map(result) : result;
          i++;
          if (i === len) {
            res(promiseResult);
          }
        }
      );
    }
  });
}


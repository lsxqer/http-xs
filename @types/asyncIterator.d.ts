import { ResponseStruct, PromiseFunction } from "./typedef";
export declare function asyncIterable<K = any, R = ResponseStruct, T = Map<K, PromiseFunction<R>>>(iterator: T, map?: (res: R) => R): Promise<Map<K, R>>;
export declare function asyncIterable<K extends string | number = string | number, R = ResponseStruct, T = Record<K, PromiseFunction<R>>>(iterator: T, map?: (res: R) => R): Promise<Record<K, R>>;
export declare function asyncIterable<R = ResponseStruct, K = Array<PromiseFunction<R>>>(iterator: K, map?: (res: R) => R): Promise<Array<R>>;

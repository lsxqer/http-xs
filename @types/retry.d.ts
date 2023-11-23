import type { ResponseStruct, PromiseFunction } from "./typedef";
export default function retry<T extends PromiseFunction<ResponseStruct> = PromiseFunction<ResponseStruct>>(execution: T, retryNumer?: number): Promise<ResponseStruct<any>>;

import type { RequestInterface } from "../typedef";
import { ResponseStruct } from "../core/complete";
export declare function xhrRequest<T = any>(opts: RequestInterface): Promise<ResponseStruct<T>>;
export declare function fetchRequest<T = any>(opts: RequestInterface): Promise<ResponseStruct<T>>;

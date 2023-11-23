import { ResponseStruct } from "../core/complete";
import type { RequestInterface } from "../typedef";
export declare function nodeRequest<T = any>(opts: RequestInterface): Promise<ResponseStruct<T>>;

import { ResponseStruct } from "../core/complete";
import { RequestInterface } from "../typedef";
export declare function nodeRequest<T = any>(opts: RequestInterface): Promise<ResponseStruct<T>>;

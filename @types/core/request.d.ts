import type { RequestInterface } from "../typedef";
import { ResponseStruct } from "./complete";
export declare function exectionOfSingleRequest<T = any>(completeOpts: RequestInterface): Promise<ResponseStruct<T>>;

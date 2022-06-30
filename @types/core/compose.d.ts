import { RequestInterface, RequestUseCallback } from "../typedef";
import { ResponseStruct } from "./complete";
export declare function compose(fns?: RequestUseCallback[]): (req: RequestInterface, finished: (req: RequestInterface) => Promise<ResponseStruct>) => any;

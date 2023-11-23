import { asyncIterable } from "./asyncIterator";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders from "./headers";
import { define, useRequest } from "./define";
import { forEach } from "./utils";
import retry from "./retry";
declare const HttpXsDefaultProto: {
    asyncIterable: typeof asyncIterable;
    request: typeof exectionOfSingleRequest;
    XsCancel: typeof XsCancel;
    XsHeaders: typeof XsHeaders;
    resolve: {
        (): Promise<void>;
        <T>(value: T): Promise<Awaited<T>>;
        <T_1>(value: T_1 | PromiseLike<T_1>): Promise<Awaited<T_1>>;
    };
    reject: <T_2 = never>(reason?: any) => Promise<T_2>;
    each: typeof forEach;
    retry: typeof retry;
    define: typeof define;
    useRequest: typeof useRequest;
};
export default HttpXsDefaultProto;

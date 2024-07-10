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
        <T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
    };
    reject: <T = never>(reason?: any) => Promise<T>;
    each: typeof forEach;
    retry: typeof retry;
    define: typeof define;
    useRequest: typeof useRequest;
};
export default HttpXsDefaultProto;

import { asyncIterable } from "./asyncIterator";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders from "./headers";
import { defineInterface, applyRequest } from "./define";
import { forEach } from "./utils";
import retry from "./retry";
declare const HttpXsDefaultProto: {
    asyncIterable: typeof asyncIterable;
    request: typeof exectionOfSingleRequest;
    XsCancel: typeof XsCancel;
    XsHeaders: typeof XsHeaders;
    contentType: {
        contentType: string;
        search: string;
        json: string;
        text: string;
        isJSON(src?: string): boolean;
    };
    resolve: {
        (): Promise<void>;
        <T>(value: T | PromiseLike<T>): Promise<T>;
    };
    reject: <T_1 = never>(reason?: any) => Promise<T_1>;
    each: typeof forEach;
    retry: typeof retry;
    defineInterface: typeof defineInterface;
    applyRequest: typeof applyRequest;
};
export default HttpXsDefaultProto;

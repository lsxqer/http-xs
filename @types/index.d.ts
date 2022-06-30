import createInstance from "./constructor";
import HttpXsDefaultProto from "./proto";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./core/httpMethod";
import { toCamelCase, XsHeaders, contentType } from "./headers";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import { applyRequest, defineInterface } from "./define";
import { asyncResolve, asyncReject } from "./utils";
import { asyncIterable } from "./asyncIterator";
import retry from "./retry";
export * from "./typedef";
declare const xs: {
    create: typeof createInstance;
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
    each: typeof import("./utils").forEach;
    retry: typeof retry;
    defineInterface: typeof defineInterface;
    applyRequest: typeof applyRequest;
};
export { HttpXsDefaultProto, xs, retry, asyncIterable, createInstance as create, Get, Get as get, Delete, Delete as delete, Post, Post as post, Put, Put as put, Head, Head as head, Patch, Patch as patch, Options, Options as options, exectionOfSingleRequest as request, toCamelCase, XsHeaders, contentType, XsCancel, applyRequest, defineInterface, asyncResolve, asyncReject };
export default xs;

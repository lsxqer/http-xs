import createInstance from "./constructor";
import { toCamelCase, XsHeaders, defaultContentType } from "./header";
import { schedulerOnSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./core/httpMethod";
import { deriveInterfaceWrapper, defineInterface } from "./define";
import { promiseResolve, promiseReject } from "./utils";
import { concurrent } from "./core/concurrent";
import { repeatExecution } from "./core/repeatExecution";
const xs = {
    repeatExecution, concurrent,
    createInstance,
    Get: Get,
    get: Get,
    Delete: Delete,
    delete: Delete,
    Post: Post,
    post: Post,
    Put: Put,
    put: Put,
    Head: Head,
    head: Head,
    Patch: Patch,
    patch: Patch,
    Options: Options,
    options: Options,
    request: schedulerOnSingleRequest,
    toCamelCase, XsHeaders, defaultContentType: defaultContentType,
    XsCancel,
    deriveInterfaceWrapper, defineInterface,
    promiseResolve: promiseResolve,
    promiseReject: promiseReject
};
export { xs, repeatExecution, concurrent, createInstance, Get, Get as get, Delete, Delete as delete, Post, Post as post, Put, Put as put, Head, Head as head, Patch, Patch as pathch, Options, Options as options, schedulerOnSingleRequest as request, toCamelCase, XsHeaders, defaultContentType, XsCancel, deriveInterfaceWrapper, defineInterface, promiseResolve, promiseReject };
export default xs;

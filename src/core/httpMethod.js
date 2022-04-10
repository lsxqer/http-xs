import { schedulerOnSingleRequest } from "./request";
import mergeConfig from "./merge";
function factoryForHttpMethod(method) {
    return (function httpMethod(url, options) {
        return schedulerOnSingleRequest(mergeConfig(url, options, method));
    });
}
export const Get = factoryForHttpMethod("get");
export const Post = factoryForHttpMethod("post");
export const Delete = factoryForHttpMethod("delete");
export const Put = factoryForHttpMethod("put");
export const Patch = factoryForHttpMethod("patch");
export const Options = factoryForHttpMethod("options");
export const Head = factoryForHttpMethod("head");

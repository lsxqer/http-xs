
import { exectionOfSingleRequest } from "./request";
import { HttpMethod, Method } from "../typedef";
import mergeConfig from "./merge";

function factoryForHttpMethod(method: Method): HttpMethod {
  return (function httpMethod(url, options) {
    return exectionOfSingleRequest(mergeConfig(url, options, method));
  }) as HttpMethod;
}

export const Get = factoryForHttpMethod("get");

export const Post = factoryForHttpMethod("post");

export const Delete = factoryForHttpMethod("delete");

export const Put = factoryForHttpMethod("put");

export const Patch = factoryForHttpMethod("patch");

export const Options = factoryForHttpMethod("options");

export const Head = factoryForHttpMethod("head");


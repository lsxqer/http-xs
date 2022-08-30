
import { exectionOfSingleRequest } from "./request";
import type { HttpMethod, Method, RequestInterface } from "../typedef";
import mergeConfig from "./merge";

function factoryForHttpMethod(method: Method): HttpMethod {

  const httpMethod = (<T = any>(url: string | RequestInterface, options: RequestInterface) => exectionOfSingleRequest<T>(mergeConfig(url, options, method))) as HttpMethod;

  return httpMethod;
}

export const Get = factoryForHttpMethod("get");

export const Post = factoryForHttpMethod("post");

export const Delete = factoryForHttpMethod("delete");

export const Put = factoryForHttpMethod("put");

export const Patch = factoryForHttpMethod("patch");

export const Options = factoryForHttpMethod("options");

export const Head = factoryForHttpMethod("head");


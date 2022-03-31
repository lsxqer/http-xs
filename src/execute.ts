import { schedulerOnSingleRequest } from "./core/request";
import { HttpMethod, Method, RequestInterface } from "./typedef";
import { forEach, isObject } from "./utils";


// reset -> 重复
export function resolveConfig(
  url: string | Partial<RequestInterface>,
  options?: Partial<RequestInterface>,
  method?: Method
): RequestInterface {
  let completeOpts: RequestInterface = {};

  if (isObject(url)) {
    forEach(url, (key, val) => completeOpts[key] = val);
  }
  else {
    completeOpts.url = url;
  }
  
  if (isObject(options)) {
    forEach(options, (key, val) => completeOpts[key] = val);
  }

  completeOpts.method = method;

  return completeOpts;
}


export function execute(method: Method): HttpMethod {

  const httpMethod = ((url, options) => schedulerOnSingleRequest(resolveConfig(url, options, method))) as HttpMethod;

  return httpMethod;
}

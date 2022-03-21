import { koaCompose } from "./compose";
import { request } from "./core/request";
import { HttpMethod, Method, RequestInterface, UseMidware } from "./typedef";
import { forEach, isObject } from "./utils";


function mergeConfig(
  method: Method,
  url: string | Partial<RequestInterface>,
  options?: Partial<RequestInterface>

): RequestInterface {
  let nextOpts = (options ?? {}) as RequestInterface;

  if (isObject(url)) {
    forEach(url, (key, val) => nextOpts[key] = val);
  }
  else {
    nextOpts.url = url;
  }

  nextOpts.method = method;

  return nextOpts;
}


export function schedulerOnSingleRequest(
  compleateOtps: RequestInterface,
  midware: UseMidware[]
) {
  return koaCompose(midware)(compleateOtps, request);
}


export function execuor(method: Method, midware?: UseMidware[]): HttpMethod {

  const fetcher = ((url, options) => schedulerOnSingleRequest(mergeConfig(method, url, options), midware)) as HttpMethod;

  return fetcher;
}

import { koaCompose } from "./compose";
import { request } from "./core/request";
import { Method, RequestInterface, UseMidware } from "./typedef";
import { forEach, isObject } from "./utils";


function maergeConfig(
  url: string | Partial<RequestInterface>, options?: Partial<RequestInterface>
):RequestInterface {

  let nextOpts = (options ?? {}) as RequestInterface;

  if (isObject(url)) {
    forEach(url, (key, val) => nextOpts[key] = val);
  }
  else {
    nextOpts.url = url;
  }
  
  return nextOpts;
}


export function exectuce(
  method:Method,
  midware: UseMidware[],
  url: string,
  options?: RequestInterface
) {

  let compleateOtps = maergeConfig(url, options);
  compleateOtps.method = method;
  return koaCompose(midware)(compleateOtps, request);
}
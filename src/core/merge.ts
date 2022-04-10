
import { Method, RequestInterface } from "../typedef";
import { isObject, copyTo } from "../utils";

export default function mergeConfig(
  url: string | Partial<RequestInterface>,
  options?: Partial<RequestInterface>,
  method?: Method
): RequestInterface {

  let completeOpts: RequestInterface = {};

  if (isObject(url)) {
    copyTo(url, completeOpts);
  }
  else {
    completeOpts.url = url;
  }

  if (isObject(options)) {
    copyTo(options, completeOpts);
  }

  completeOpts.method = method;

  return completeOpts;
}

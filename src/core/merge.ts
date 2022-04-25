
import { Method, RequestInterface } from "../typedef";
import { isObject, copyTo } from "../utils";

export default function mergeConfig(
  url: string | Partial<RequestInterface>,
  options?: Partial<RequestInterface>,
  method?: Method
): RequestInterface {

  let completeOpts: RequestInterface = {};

  if (typeof url === "string") {
    completeOpts.url = url;
  }

  if (isObject(url)) {
    copyTo(url, completeOpts);
  }

  if (isObject(options)) {
    copyTo(options, completeOpts);
  }

  completeOpts.method = method;

  return completeOpts;
}


import XsHeaders from "src/headers";
import { Method, RequestInterface } from "../typedef";
import { isObject, forEach, isArray } from "../utils";

export default function mergeConfig(
  url: string | Partial<RequestInterface>,
  options?: Partial<RequestInterface>,
  method?: Method
): RequestInterface {

  const completeOpts: RequestInterface = {};

  if (typeof url === "string") {
    completeOpts.url = url;
  }

  const each = (key: keyof RequestInterface, val) => {
    if (key === "headers") {
      completeOpts[key] = new XsHeaders(val);
      return;
    }

    if (isArray(val)) {
      let exist = completeOpts[key] as any[];

      if (!isArray(exist)) {
        exist = completeOpts[key as any] = [];
      }

      val.forEach(v => exist.push(v));
    }

    // 数组的情况
    completeOpts[key as any] = val;
  };


  if (isObject(url)) {
    forEach(url, each);
  }

  if (isObject(options)) {
    forEach(options, each);
  }

  completeOpts.method = method;
  return completeOpts;
}

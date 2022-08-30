
import XsHeaders from "src/headers";
import { isObject, forEach, isArray } from "../utils";
import type { Method, RequestInterface, XsHeaderImpl } from "../typedef";

export default function mergeConfig(
  url: string | Partial<RequestInterface>,
  options?: Partial<RequestInterface>,
  method?: Method
): RequestInterface {

  const completeOpts: RequestInterface = {};

  if (typeof url === "string") {
    completeOpts.url = url;
  }

  let header = completeOpts.headers as XsHeaderImpl;

  const each = (key: keyof RequestInterface, val) => {
    if (!(header instanceof XsHeaders)) {
      header = new XsHeaders();
    }

    if (key === "headers") {
      XsHeaders.forEach(val, (k, v) => {
        header.set(k, v);
      });
      return;
    }

    if (isArray(val)) {
      let exist = completeOpts[key] as any[];

      if (!isArray(exist)) {
        exist = completeOpts[key as any] = [];
      }

      val.forEach(v => exist.push(v));
      return;
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


import { EnhanceConfig, RequestInterface, ResponseStruct } from "./types";
import { fetchRequest, xhrRequest } from "./adapter/browser";
import { isNode } from "./utils";
import { nodeRequest } from "./adapter/http";

/**
 * 根据不同情况返回所支持的函数
 * @param config  请求配置
 * @returns request 一个用于执行请求的函数
 */
export default function dispatchRequest(config: RequestInterface): <T = any, R = ResponseStruct<T>>(opts: EnhanceConfig<null, null>) => Promise<R> {
  if (typeof config.request === "function") {
    return config.request;
  }

  if (isNode) {
    return nodeRequest;
  } else if (
    config.type === "xhr"
    || typeof globalThis.fetch === "undefined"
    || (typeof config.cancel !== "undefined" && typeof AbortController === "undefined")
    || typeof config.onUploadProgress === "function"
    || typeof config.onProgress === "function"
    || typeof config.timeout === "number"
    || typeof config.auth === "object"
  ) {
    config.type = "xhr";
    return xhrRequest;
  }

  config.type = "fetch";
  return fetchRequest;
}


import type { RequestInterface, ResponseStruct } from "../typedef";
import { fetchRequest, xhrRequest } from "./browser";
import { isAsyncFunction, isNodePlatform } from "../utils";
import { nodeRequest } from "./http";

/**
 * 根据不同情况返回所支持的函数
 * @param config  请求配置
 * @returns request 一个用于执行请求的函数
 */
export default function dispatchRequest(config: RequestInterface): <T = any>(opts: RequestInterface) => Promise<ResponseStruct<T>> {
  let existRequestMode = config.requestMode;
  let haveRequestMode = existRequestMode === "fetch" || existRequestMode === "xhr";
  // custom request
  if (typeof config.customRequest === "function") {
    return config.customRequest;
  }
  if (isNodePlatform) {
    if (typeof fetch !== "undefined") {
      if (isAsyncFunction(fetch)) {
        if (!haveRequestMode) {
          config.requestMode = "fetch";
        }
        return fetchRequest;
      }
    }
    return nodeRequest;
  }
  if (
    config.requestMode === "xhr" ||
    typeof globalThis.fetch === "undefined" ||
    (typeof config.cancel !== "undefined" && typeof AbortController === "undefined") ||
    typeof config.onUploadProgress === "function" ||
    typeof config.onProgress === "function" ||
    typeof config.timeout === "number" ||
    typeof config.auth === "object"
  ) {
    config.requestMode = "xhr";
    return xhrRequest;
  }

  config.requestMode = "fetch";
  return fetchRequest;
}

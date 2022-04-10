import { schedulerOnSingleRequest } from "./core/request";
import mergeConfig from "./core/merge";
import XsHeaders, { defaultContentType } from "./header";
import { UseMidware, Method, RequestInterface, XsHeaderImpl } from "./typedef";
import { isObject, promiseReject, copyTo, promiseResolve, forEach } from "./utils";
import XsCancel from "./cancel";
import { deriveInterfaceWrapper, defineInterface, RecordInterface, repeatExecution } from "src";
import { concurrent } from "./core/concurrent";

const methodNamed = [ "get", "post", "delete", "put", "patch", "options", "head" ] as Method[];


interface DefaultConfig {
  use?: UseMidware[];
  headers?: RequestInterface["headers"];

  timeout?: number;
  baseUrl?: string;
  responseType?: RequestInterface["responseType"];
  requestMode?: RequestInterface["requestMode"];
}

function pushMidHandler(...args: UseMidware[]);
function pushMidHandler(mids: UseMidware[]);
function pushMidHandler(this: { defaultConfig: DefaultConfig }, ...args) {
  // 可能是10
  this.defaultConfig.use.push(...args.flat(10));
  return this;
}


function mergeDefaultInceConfig(defaultConfig: DefaultConfig, customReq: RequestInterface) {

  let { headers, baseUrl = "" } = defaultConfig;

  // header
  customReq.headers = new XsHeaders(customReq.headers);

  (headers as XsHeaderImpl).forEach(function each(val, key) {
    (customReq.headers as XsHeaderImpl).set(key, val);
  });

  // url
  customReq.url = baseUrl + customReq.url.replace(/^\?*/, "/");

  // use
  customReq.use ??= [];
  customReq.use = defaultConfig.use.concat(customReq.use);

  customReq.responseType ??= defaultConfig.responseType;
  customReq.requestMode ??= defaultConfig.requestMode;

  return customReq;
}

function resolveDefaultConfig(defaultConfig?: DefaultConfig) {

  if (!isObject(defaultConfig)) {
    defaultConfig = {};
  }

  defaultConfig.use ??= [];

  defaultConfig.headers = new XsHeaders(defaultConfig.headers);

  !(defaultConfig.headers.has(defaultContentType.contentType)) && defaultConfig.headers.set(defaultContentType.contentType, defaultContentType.search);

  defaultConfig.baseUrl ??= "";
  defaultConfig.baseUrl = defaultConfig.baseUrl.replace(/[?/]*$/, "");

  return Object.freeze(defaultConfig);
}


function createInstance(defaultInstaceConfig?: DefaultConfig) {

  defaultInstaceConfig = resolveDefaultConfig(defaultInstaceConfig);

  const proto = Object.create(null), instce = Object.create(null);

  Object.setPrototypeOf(instce, Object.setPrototypeOf(proto, {
    defaultConfig: defaultInstaceConfig,
    injectIntercept: pushMidHandler,
    request: schedulerOnSingleRequest
  }));

  methodNamed.forEach(function each(method) {
    instce[method] = async function HttpMethod(this: { defaultConfig: DefaultConfig }, url, opts) {
      // ! 会覆盖
      // ? merge baseConfig
      return schedulerOnSingleRequest(mergeDefaultInceConfig(instce.defaultConfig, mergeConfig(url, opts)));
    };
  });

  instce.XsCancel = XsCancel;
  instce.XsHeader = XsHeaders;
  instce.defaultContentType = { ...defaultContentType };
  instce.deriveInterfaceWrapper = deriveInterfaceWrapper;
  instce.promiseResolve = promiseResolve;
  instce.promiseReject = promiseReject;
  instce.copyTo = copyTo;
  instce.forEach = forEach;
  instce.repeatExecution = repeatExecution;
  instce.concurrent = concurrent;

  instce.defineInterface = function (apiDefine: RecordInterface) {
    return defineInterface(instce, apiDefine);
  };

  instce.setProfix = function (profix: string) {
    defaultInstaceConfig.baseUrl += profix.replace(/^\/*/, "/");
  };


  return instce;
}

export { createInstance };
export default createInstance;
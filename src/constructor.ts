import mergeConfig from "./core/merge";
import { RequestUseCallback, Method, RequestInterface, XsHeaderImpl, HttpMethod, CustomRequest } from "./typedef";
import { copyTo, forEach, isNil, isObject, asyncReject, asyncResolve } from "./utils";
import { defineInterface, DefineMethod, RecordInterface } from "./define";
import HttpXsDefaultProto from "./proto";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders, { contentType } from "./headers";
import retry from "./retry";
import { asyncIterable } from "./asyncIterator";

const methodNamed = [ "get", "post", "delete", "put", "patch", "options", "head" ] as Method[];

interface RequestInstanceInterface {

  /**
   * 实例拦截器
   */
  interceptors?: RequestUseCallback<any>[];

  /**
   * 共享headers
   */
  headers?: RequestInterface["headers"];

  /**
   * 超时时间
   */
  timeout?: number;

  /**
   * 共享url
   */
  baseUrl?: string;

  /**
   * 实例响应类型
   */
  responseType?: RequestInterface["responseType"];

  /**
   * fetch｜xhr
   */
  requestMode?: RequestInterface["requestMode"];

  /**
   * 自定义请求执行函数
   */
  customRequest?: CustomRequest;
}

function mergeDefaultInceConfig(requestInstanceInterface: RequestInstanceInterface, customReq: RequestInterface) {

  let { headers, baseUrl = "" } = requestInstanceInterface;

  // header
  if (!isNil(requestInstanceInterface.headers)) {
    customReq.headers = new XsHeaders(customReq.headers);

    (headers as XsHeaderImpl).forEach(function each(val, key) {
      (customReq.headers as XsHeaderImpl).set(key, val);
    });
  }

  // url
  customReq.url = baseUrl + customReq.url.replace(/^\/*/, "/");

  let existsInterceptor = customReq.interceptor;
  let hasInterceptor = Array.isArray(existsInterceptor) || typeof existsInterceptor === "function";

  let del = (async (_req, next) => next().then(r => {
    if (hasInterceptor) {
      customReq.interceptor = existsInterceptor;
    }
    else {
      delete customReq.interceptor;
    }

    del = existsInterceptor = null;
    return r;
  })) as RequestUseCallback;

  // use
  if (Array.isArray(requestInstanceInterface.interceptors)) {
    customReq.interceptor = requestInstanceInterface.interceptors.concat(del, existsInterceptor).filter(Boolean);
  }
  if (typeof requestInstanceInterface.responseType === "string" && typeof customReq.responseType !== "string") {
    customReq.responseType = requestInstanceInterface.responseType;
  }
  if (typeof requestInstanceInterface.requestMode === "string" && typeof customReq.requestMode !== "string") {
    customReq.requestMode = requestInstanceInterface.requestMode;
  }
  if (typeof requestInstanceInterface.customRequest === "function" && typeof customReq.customRequest !== "function") {
    customReq.customRequest = requestInstanceInterface.customRequest;
  }

  return customReq;
}

function resolveDefaultConfig(requestInstanceInterface?: RequestInstanceInterface) {

  if (!isObject(requestInstanceInterface)) {
    requestInstanceInterface = {};
  }
  if (typeof requestInstanceInterface.baseUrl === "string") {
    requestInstanceInterface.baseUrl = requestInstanceInterface.baseUrl.replace(/[?/]*$/, "");
  }
  /* eslint-disable eqeqeq */
  if (requestInstanceInterface.headers != null) {
    requestInstanceInterface.headers = new XsHeaders(requestInstanceInterface.headers);
  }

  return requestInstanceInterface;
}

interface UseFunction<
  R = Instance
  > {
  <T = any>(fn: RequestUseCallback<T>): R;
  <T = any>(fns: RequestUseCallback<T>[]): R;
  <T = any>(...fns: RequestUseCallback<T>[]): R;
  delete(fn: RequestUseCallback<any>): boolean;
}

type Instance = Omit<
  typeof HttpXsDefaultProto, "defineInterface"> &
  { [key in Method]: HttpMethod } &
{
  use: UseFunction;
  defineInterface: <T extends RecordInterface = RecordInterface >(apiDefine: T) => DefineMethod<T>;
};

function createInstance(defaultInstaceConfig?: RequestInstanceInterface): Instance {

  const fullInstceConf = resolveDefaultConfig(defaultInstaceConfig);
  const instce = Object.create(null);

  instce.RequestInstanceInterface = fullInstceConf;

  instce.use = function use(...fns: RequestUseCallback[]) {
    let uses = instce.RequestInstanceInterface.interceptors;

    if (!Array.isArray(uses)) {
      uses = instce.RequestInstanceInterface.interceptors = [];
    }

    let queue = [ ...fns ];

    while (queue.length > 0) {
      const fn = queue[0];

      if (typeof fn === "function") {
        uses.push(fn);
      }
      else {
        queue.unshift(...fn as RequestUseCallback[]);
      }
      queue.shift();
    }

    return this;
  };

  instce.use.delete = function deleteUseFunction(fn: RequestUseCallback) {
    let used = instce.RequestInstanceInterface.interceptors;
    if (!Array.isArray(used)) {
      return false;
    }
    let deletion = used.splice(used.indexOf(fn), 1);
    return deletion.length !== 0;
  };

  methodNamed.forEach(function each(method) {
    instce[method] = function HttpMethod(this: { RequestInstanceInterface: RequestInstanceInterface }, url, opts) {
      // ! 会覆盖
      // ? merge baseConfig
      return instce.request(mergeConfig(url, opts, method));
    };
  });

  instce.defineInterface = function (apiDefine: RecordInterface) {
    return defineInterface(instce.request, apiDefine);
  };

  instce.setProfix = function (nextUrl: string, replace = false) {
    if (replace) {
      this.RequestInstanceInterface.baseUrl = nextUrl;
      return;
    }

    fullInstceConf.baseUrl += nextUrl.replace(/^\/*/, "/");
  };

  instce.request = function instanceRequest(config: RequestInterface) {
    let finish = mergeDefaultInceConfig(instce.RequestInstanceInterface, config);
    return exectionOfSingleRequest(finish);
  };

  instce.asyncIterable = asyncIterable;
  instce.XsCancel = XsCancel;
  instce.XsHeaders = XsHeaders;
  instce.contentType = { ...contentType };
  instce.resolve = asyncResolve;
  instce.resject = asyncReject;
  instce.copyTo = copyTo;
  instce.each = forEach;
  instce.retry = retry;

  return instce;
}

export { createInstance };
export default createInstance;

import mergeConfig from "./core/merge";
import { RequestUseCallback, Method, RequestInterface, HttpMethod, CustomRequest } from "./typedef";
import { forEach, isNil, isObject, asyncReject, asyncResolve } from "./utils";
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

function mergeDefaultInceConfig(instReq: RequestInstanceInterface, customReq: RequestInterface) {

  let { headers, baseUrl = "" } = instReq;

  // 实例headers属性不为空
  if (!isNil(headers)) {
    let nextHeader = new XsHeaders(headers);

    XsHeaders.forEach(customReq.headers, (k, v) => {
      nextHeader.set(k, v);
    });

    customReq.headers = nextHeader;
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
  if (Array.isArray(instReq.interceptors)) {
    customReq.interceptor = instReq.interceptors.concat(del, existsInterceptor ?? []);
  }
  if (typeof instReq.responseType === "string" && typeof customReq.responseType !== "string") {
    customReq.responseType = instReq.responseType;
  }
  if (typeof instReq.requestMode === "string" && typeof customReq.requestMode !== "string") {
    customReq.requestMode = instReq.requestMode;
  }
  if (typeof instReq.customRequest === "function" && typeof customReq.customRequest !== "function") {
    customReq.customRequest = instReq.customRequest;
  }

  return customReq;
}

function resolveDefaultConfig(requestInstanceInterface?: RequestInstanceInterface) {

  if (!isObject(requestInstanceInterface)) {
    return {};
  }

  if (typeof requestInstanceInterface.baseUrl === "string") {
    requestInstanceInterface.baseUrl = requestInstanceInterface.baseUrl.replace(/[?/]*$/, "");
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

  instce.baseRequestConf = fullInstceConf;

  instce.use = function use(...fns: RequestUseCallback[]) {
    let uses = instce.baseRequestConf.interceptors;

    if (!Array.isArray(uses)) {
      uses = instce.baseRequestConf.interceptors = [];
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
    let used = instce.baseRequestConf.interceptors;
    if (!Array.isArray(used)) {
      return false;
    }
    let deletion = used.splice(used.indexOf(fn), 1);
    return deletion.length !== 0;
  };

  methodNamed.forEach(function each(method) {
    instce[method] = function HttpMethod(this: { baseRequestConf: RequestInstanceInterface }, url, opts) {
      return instce.request(mergeConfig(url, opts, method));
    };
  });

  instce.defineInterface = function (apiDefine: RecordInterface) {
    return defineInterface(instce.request, apiDefine);
  };

  instce.setProfix = function (nextUrl: string, replace = false) {
    if (replace) {
      instce.baseRequestConf.baseUrl = nextUrl;
      return;
    }

    fullInstceConf.baseUrl += nextUrl.replace(/^\/*/, "/");
  };

  instce.request = function instanceRequest(config: RequestInterface) {
    let finish = mergeDefaultInceConfig(instce.baseRequestConf, config);
    return exectionOfSingleRequest(finish);
  };

  instce.asyncIterable = asyncIterable;
  instce.XsCancel = XsCancel;
  instce.XsHeaders = XsHeaders;
  instce.contentType = { ...contentType };
  instce.resolve = asyncResolve;
  instce.resject = asyncReject;
  instce.each = forEach;
  instce.retry = retry;

  return instce;
}

export { createInstance };
export default createInstance;

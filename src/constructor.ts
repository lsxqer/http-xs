import mergeConfig from "./core/merge";
import { forEach, isNil, isObject, asyncReject, asyncResolve } from "./utils";
import { UseRequest, define, } from "./define";
import HttpXsDefaultProto from "./proto";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders from "./headers";
import retry from "./retry";
import { asyncIterable } from "./asyncIterator";
import type { RequestUseCallback, Method, RequestInterface, HttpMethod, CustomRequest } from "./typedef";

const methodNamed = ["get", "post", "delete", "put", "patch", "options", "head"] as Method[];

interface RequestInstanceInterface {

  /**
   * 实例拦截器
   */
  interceptors?: RequestUseCallback<any>[];

  /**
   * 实例共享headers
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

const defaultMergeKeys = "responseType, customRequest, timeout, requestMode";
function mergeDefaultInceConfig(instReq: RequestInstanceInterface, customReq: RequestInterface) {

  let { headers, baseUrl = "" } = instReq;
  let keys = Object.keys(instReq).filter(key => defaultMergeKeys.includes(key));

  // 实例headers属性不为空
  if (!isNil(headers)) {
    let nextHeader = new XsHeaders(headers);

    XsHeaders.forEach(customReq.headers, (k, v) => {
      nextHeader.set(k, v);
    });

    customReq.headers = nextHeader;
  }

  let inputRequrl = customReq.url;
  if (!(/^\s*https?/.test(inputRequrl))) {
    customReq.url = baseUrl + inputRequrl.replace(/^\/*/, "/");
  }

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
  // 构造函数中选择[interceptors]不为空
  if (Array.isArray(instReq.interceptors)) {
    customReq.interceptor = instReq.interceptors.concat(del, existsInterceptor ?? []);
  }

  keys.forEach(key => {
    let customVal = customReq[key];

    // 如果实例请求中val为nil，选用实例配置中的val
    if (isNil(customVal)) {
      customReq[key] = instReq[key];
    }
  });

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
  typeof HttpXsDefaultProto, "define"> &
  { [key in Method]: HttpMethod } &
{
  use: UseFunction;
  define: UseRequest
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

    let queue = [...fns];

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


  instce.setProfix = function (nextUrl: string, replace = false) {
    if (replace) {
      instce.baseRequestConf.baseUrl = nextUrl;
      return;
    }

    fullInstceConf.baseUrl += nextUrl.replace(/^\/*/, "/");
  };


  function instanceRequest(config: RequestInterface) {
    let finish = mergeDefaultInceConfig(instce.baseRequestConf, config);
    return exectionOfSingleRequest(finish);
  };

  instce.define = define.bind(null, instanceRequest);

  instce.request = instanceRequest;
  instce.asyncIterable = asyncIterable;
  instce.XsCancel = XsCancel;
  instce.XsHeaders = XsHeaders;
  instce.resolve = asyncResolve;
  instce.resject = asyncReject;
  instce.each = forEach;
  instce.retry = retry;

  return instce;
}

export { createInstance };
export default createInstance;

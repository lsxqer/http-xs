import { exectionOfSingleRequest } from "./core/request";
import mergeConfig from "./core/merge";
import { UseMidware, Method, RequestInterface, XsHeaderImpl, HttpMethod } from "./typedef";
import { isObject } from "./utils";
import { RecordInterface } from "./parts/define";
import HttpXsDefaultProto from "./proto";

const methodNamed = [ "get", "post", "delete", "put", "patch", "options", "head" ] as Method[];

interface DefaultConfig {
  interceptor?: UseMidware[];
  headers?: RequestInterface["headers"];

  timeout?: number;
  baseUrl?: string;
  responseType?: RequestInterface["responseType"];
  requestMode?: RequestInterface["requestMode"];
}

function pushMidHandler(...args: UseMidware[]);
function pushMidHandler(mids: UseMidware[]);
function pushMidHandler(fn: UseMidware);
function pushMidHandler(this: { defaultConfig: DefaultConfig }, ...args) {
  // 可能是10
  this.defaultConfig.interceptor.push(...args.flat(10));
  return this;
}


function mergeDefaultInceConfig(defaultConfig: DefaultConfig, customReq: RequestInterface) {

  let { headers, baseUrl = "" } = defaultConfig;

  // header
  customReq.headers = new HttpXsDefaultProto.XsHeaders(customReq.headers);

  (headers as XsHeaderImpl).forEach(function each(val, key) {
    (customReq.headers as XsHeaderImpl).set(key, val);
  });

  // url
  customReq.url = baseUrl + customReq.url.replace(/^\/*/, "/");

  // use
  customReq.interceptor = defaultConfig.interceptor.concat(customReq.interceptor).filter(Boolean);

  if (typeof  defaultConfig.responseType === "string" && typeof customReq.responseType !== "string") {
    customReq.responseType = defaultConfig.responseType;
  }
  
  if (typeof  defaultConfig.requestMode === "string" && typeof defaultConfig.requestMode !== "string") {
    customReq.requestMode = defaultConfig.requestMode;
  }

  return customReq;
}

function resolveDefaultConfig(defaultConfig?: DefaultConfig) {

  if (!isObject(defaultConfig)) {
    defaultConfig = {};
  }

  defaultConfig.interceptor ??= [];

  defaultConfig.headers = new HttpXsDefaultProto.XsHeaders(defaultConfig.headers);

  !(defaultConfig.headers.has(HttpXsDefaultProto.contentType.contentType)) && defaultConfig.headers.set(HttpXsDefaultProto.contentType.contentType, HttpXsDefaultProto.contentType.search);

  defaultConfig.baseUrl ??= "";
  defaultConfig.baseUrl = defaultConfig.baseUrl.replace(/[?/]*$/, "");

  return defaultConfig;
}

function createInstance(defaultInstaceConfig?: DefaultConfig): typeof HttpXsDefaultProto & { [key in Method]: HttpMethod } {

  const fullInstceConf = resolveDefaultConfig(defaultInstaceConfig);
  const instce = Object.create(null);

  instce.defaultConfig = fullInstceConf;

  instce.use = function use(fn: UseMidware) {
    pushMidHandler.call(this, fn);
    return this;
  };

  methodNamed.forEach(function each(method) {
    instce[method] = function HttpMethod(this: { defaultConfig: DefaultConfig }, url, opts) {
      // ! 会覆盖
      // ? merge baseConfig
      let finish = mergeDefaultInceConfig(this.defaultConfig, mergeConfig(url, opts));
      finish.method = method;
      return exectionOfSingleRequest(finish);
    };
  });

  instce.defineInterface = function (apiDefine: RecordInterface) {
    return HttpXsDefaultProto.defineInterface(instce, apiDefine);
  };

  instce.setProfix = function (nextUrl: string, replace = false) {
    if (replace) {
      this.defaultConfig.baseUrl = nextUrl;
      return;
    }

    fullInstceConf.baseUrl += nextUrl.replace(/^\/*/, "/");
  };


  Object.setPrototypeOf(instce, HttpXsDefaultProto);

  return instce;
}

export { createInstance };
export default createInstance;
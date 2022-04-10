var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { schedulerOnSingleRequest } from "./core/request";
import mergeConfig from "./core/merge";
import XsHeaders, { defaultContentType } from "./header";
import { isObject, promiseReject, copyTo, promiseResolve, forEach } from "./utils";
import XsCancel from "./cancel";
import { deriveInterfaceWrapper, defineInterface, repeatExecution } from "src";
import { concurrent } from "./core/concurrent";
const methodNamed = ["get", "post", "delete", "put", "patch", "options", "head"];
function pushMidHandler(...args) {
    // 可能是10
    this.defaultConfig.use.push(...args.flat(10));
    return this;
}
function mergeDefaultInceConfig(defaultConfig, customReq) {
    var _a, _b, _c;
    let { headers, baseUrl = "" } = defaultConfig;
    // header
    customReq.headers = new XsHeaders(customReq.headers);
    headers.forEach(function each(val, key) {
        customReq.headers.set(key, val);
    });
    // url
    customReq.url = baseUrl + customReq.url.replace(/^\?*/, "/");
    // use
    (_a = customReq.use) !== null && _a !== void 0 ? _a : (customReq.use = []);
    customReq.use = defaultConfig.use.concat(customReq.use);
    (_b = customReq.responseType) !== null && _b !== void 0 ? _b : (customReq.responseType = defaultConfig.responseType);
    (_c = customReq.requestMode) !== null && _c !== void 0 ? _c : (customReq.requestMode = defaultConfig.requestMode);
    return customReq;
}
function resolveDefaultConfig(defaultConfig) {
    var _a, _b;
    if (!isObject(defaultConfig)) {
        defaultConfig = {};
    }
    (_a = defaultConfig.use) !== null && _a !== void 0 ? _a : (defaultConfig.use = []);
    defaultConfig.headers = new XsHeaders(defaultConfig.headers);
    !(defaultConfig.headers.has(defaultContentType.contentType)) && defaultConfig.headers.set(defaultContentType.contentType, defaultContentType.search);
    (_b = defaultConfig.baseUrl) !== null && _b !== void 0 ? _b : (defaultConfig.baseUrl = "");
    defaultConfig.baseUrl = defaultConfig.baseUrl.replace(/[?/]*$/, "");
    return Object.freeze(defaultConfig);
}
function createInstance(defaultInstaceConfig) {
    defaultInstaceConfig = resolveDefaultConfig(defaultInstaceConfig);
    const proto = Object.create(null), instce = Object.create(null);
    Object.setPrototypeOf(instce, Object.setPrototypeOf(proto, {
        defaultConfig: defaultInstaceConfig,
        injectIntercept: pushMidHandler,
        request: schedulerOnSingleRequest
    }));
    methodNamed.forEach(function each(method) {
        instce[method] = function HttpMethod(url, opts) {
            return __awaiter(this, void 0, void 0, function* () {
                // ! 会覆盖
                // ? merge baseConfig
                return schedulerOnSingleRequest(mergeDefaultInceConfig(instce.defaultConfig, mergeConfig(url, opts)));
            });
        };
    });
    instce.XsCancel = XsCancel;
    instce.XsHeader = XsHeaders;
    instce.defaultContentType = Object.assign({}, defaultContentType);
    instce.deriveInterfaceWrapper = deriveInterfaceWrapper;
    instce.promiseResolve = promiseResolve;
    instce.promiseReject = promiseReject;
    instce.copyTo = copyTo;
    instce.forEach = forEach;
    instce.repeatExecution = repeatExecution;
    instce.concurrent = concurrent;
    instce.defineInterface = function (apiDefine) {
        return defineInterface(instce, apiDefine);
    };
    instce.setProfix = function (profix) {
        defaultInstaceConfig.baseUrl += profix.replace(/^\/*/, "/");
    };
    return instce;
}
export { createInstance };
export default createInstance;

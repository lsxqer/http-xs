import { forEach, getType, isArray, isEmpty, isNode, isAbsoluteURL, compose, isObject, isUndef } from "./utils";
import dispatchRequest from "./dispatchRequest";
import { maergeConfig, parserQueryString, stringify } from "./helper";
import sendRequest from "./request";
import { createXsHeader, defaultContentType } from "./xsHeader";
import {
  Method, RequestInterface, EnhanceConfig, BaseConfig,
  HttpMethod,
  TransformationRequest,
  XsHeaderImpl,
  TransformationResponse,
  ResponseStruct
} from "./types";

function defaultTransformReq(transformReq: TransformationRequest[], config: EnhanceConfig<null, null>) {

  // url
  let originalUrl = config.url ?? " ";

  if (!isAbsoluteURL(originalUrl)) {
    originalUrl = originalUrl.replace(/^\/*/, "/").replace(/\/*$/, "").replace(/\s*/g, "").replace(/#[\w\W]*/g, "");
  }

  // query
  let sourceQuery = config.query, nextQuery;
  [ originalUrl, nextQuery ] = parserQueryString(originalUrl);

  if (typeof sourceQuery === "string") {
    let [ , query ] = parserQueryString(`?${sourceQuery.replace(/^\?+/, "?")}`);
    forEach(query, (key, val) => nextQuery[key] = val);
  } else if (sourceQuery instanceof URLSearchParams) {
    sourceQuery.forEach((val, key) => nextQuery[key] = val);
  } else if (isObject(sourceQuery)) {
    forEach(sourceQuery, (key, val) => nextQuery[key] = val);
  }

  // url
  config.url = originalUrl;

  // header
  let headers = config.headers = createXsHeader(config.headers, true);

  // tranform compose
  config = compose(transformReq, config);

  // body
  let body = config.body;

  if (body !== undefined && body !== null) {
    let userTypeVal = headers.get(defaultContentType.contentType), replaceContentTypeVal = userTypeVal;

    switch (getType(body).toLowerCase()) {
      case "array":
      case "urlsearchparams":
      case "object": {
        if ((replaceContentTypeVal ?? "").includes("application/json") || isObject(body) || isArray(body)) {
          body = JSON.stringify(body);
        } else {
          body = new URLSearchParams(body as URLSearchParams | Record<string, string>).toString();
        }

        replaceContentTypeVal = defaultContentType.search;

        if (isNode) {
          body = Buffer.from(body, "utf-8");
        }
        break;
      }
      case "string":
        replaceContentTypeVal = defaultContentType.text;
        break;
      case "arraybuffer": {
        if (isNode) {
          body = Buffer.from(new Uint8Array(body as ArrayBuffer));
        }
        break;
      }
      case "formdata": {
        replaceContentTypeVal = userTypeVal = null;
        headers.delete(defaultContentType.contentType);
      }
    }

    if (userTypeVal === null && replaceContentTypeVal !== null) {
      headers.set(defaultContentType.contentType, replaceContentTypeVal);
    }

    config.body = body;
  }

  config.url = `${config.url}${stringify(nextQuery)}`;

  // 分配request
  config.request = dispatchRequest(config);

  // 设置默认responseType
  if (isUndef(config.responseType)) {
    config.responseType = config.type === "fetch" ? "json" : "";
  }

  return config;
}

function defaultTransformRes(transformRes: TransformationResponse<ResponseStruct>[], result: ResponseStruct) {

  let responseType = result.enhanceConfig.responseType ?? "";
  let response = result.response;

  switch (responseType.toLowerCase()) {
    case "blob":
    case "stream":
    case "buffer":
      break;
    case "u8array":
      response = new Uint8Array(response);
      break;
    case "arraybuffer":
      if (isNode) {
        response = response.buffer;
      }
      break;
    case "text":
    case "utf8":
    case "json":
      /**
       * fetch 会默认选择会json, xhr对象支持响应json格式。所以在浏览器环境返回就可
       */
      if (!isNode) {
        break;
      }
    /* eslint-disable no-fallthrough*/
    default: {
      response = response.toString("utf-8");

      // 在node环境如果是json就parse一下
      if (typeof response === "string" && ([ "text", "utf8" ].includes(responseType) === false)) {
        try {
          response = JSON.parse(response);
        } catch (err) { }/* eslint-disable-line no-empty*/
      }
    }
  }

  result.response = response;

  return compose(transformRes, result);
}

function mergeBaseConfig(src: BaseConfig, target: EnhanceConfig<null, null>) {
  let { timeout, url } = target;

  if (typeof timeout !== "number" && typeof src.timeout === "number") {
    target.timeout = src.timeout;
  }
  if (typeof src.baseURL === "string") {
    target.url = src.baseURL.replace(/\/*$/, "") + url;
  }

  (src.headers as XsHeaderImpl).forEach((val, key) => {
    target.headers.set(key, val);
  });

  return target;
}


const filterNull = el => el !== undefined && el !== null;

export function composeConfig(src: BaseConfig | null, target: RequestInterface): EnhanceConfig<TransformationRequest, TransformationResponse> {

  let targetTransformReq = [ target.transformationRequest ];
  let targetTransformRes = [ target.transformationResponse ];

  if (!isEmpty(src)) {
    let { transformationRequest = [], transformationResponse = [] } = src;

    targetTransformReq.push(mergeBaseConfig.bind(null, src));

    targetTransformReq.push(transformationRequest);
    targetTransformRes.push(transformationResponse);
  }

  target.transformationRequest = defaultTransformReq.bind(null,
    targetTransformReq.flat(5).filter(filterNull));
  target.transformationResponse = defaultTransformRes.bind(null, targetTransformRes.flat(5).filter(filterNull));

  return target as EnhanceConfig<TransformationRequest, TransformationResponse>;
}


export function createHttpMethod(
  methodName: Method,
  enhanceConfig: (target: RequestInterface) => EnhanceConfig<TransformationRequest, TransformationResponse>
): HttpMethod {

  function method(url: string | Partial<RequestInterface>, config?: Partial<RequestInterface>) {

    let mergeConf = maergeConfig(url, config);
    mergeConf.method = methodName;

    let finishConf = enhanceConfig(mergeConf);
    return sendRequest(finishConf);
  }
  return method;
}


export const request = <T = any, R = ResponseStruct<T>>(config: RequestInterface): Promise<R> => {
  let finishConf = composeConfig(null, config);
  return sendRequest<T, R>(finishConf);
};
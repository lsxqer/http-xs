import { header, RecordInterface, XsHeaders } from "src";
import dispatchRequest, { ReturnImpl } from "./dispatchRequest";
import { maergeConfig, parserQueryString, stringify } from "./helper";
import { HeaderOption, RequestPayload, XsHeaderImpl ,HttpMethod, Method} from "./typedef";
import { RequestInterface } from "./typedef";
import { forEach, getType, isAbsoluteURL, isArray, isNode, isObject, isUndef } from "./utils";
import { defaultContentType } from "./xsHeader";
import  {proxyResponse} from "./return"
import request from "./request";



export function requestTrnsform(config:RequestPayload & RequestInterface & HeaderOption) {
  
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
  let headers = config.headers = XsHeaders.from(config.headers, true);

  // tranform compose
  // config = compose(transformReq, config);

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
  config.request = dispatchRequest(config as RecordInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>);

  // 设置默认responseType
  if (isUndef(config.responseType)) {
    config.responseType = config.type === "fetch" ? "json" : "";
  }

  return config;
}


export function responseTransform(responseType, response) {
  // return
    // let {response, request, status, message, headers, type} = returns;
    // let responseType = request.responseType;

    
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

  return response;
}




export function defineHttpMethod(methodName:Method):HttpMethod {
  return (url:string|Partial<RequestPayload|RequestInterface|HeaderOption>,config?:Partial<RequestPayload|RequestInterface|HeaderOption>) => {
    let conf = maergeConfig(url,config)
    conf.method = methodName;
    return request(conf)
  }
}
import { RequestInterface } from "./types";
import { forEach, isObject, isEmpty, isArray } from "./utils";

// keys
export const reqKeys = [
  "url",
  "method",
  "headers",
  "query",
  "hash",
  "cancel",
  "responseType",
  "body",
  "timeout",
  "progress",
  "withCredentials",
  "transformationRequest",
  "transformationResponse",
  "type",
  "request",
  "cache",
  "credentials",
  "mode",
  "integrity",
  "keepalive",
  "redirect",
  "referrer",
  "referrerPolicy",
  "family",
  "maxHeaderSize",
  "setHost",
  "auth",
  "defaultPort",
  "localAddress",
  "socketPath",
  "agent",
  "encoding"
];

export function maergeConfig(url: string | Partial<RequestInterface>, config?: Partial<RequestInterface>): RequestInterface {
  let nextConfig = (config ?? {}) as RequestInterface;
  if (isObject(url)) {
    forEach(url, (key, val) => {
      nextConfig[key] = val;
    });
  }
  if (typeof url === "string") {
    nextConfig.url = url;
  }
  return nextConfig;
}


export function decode(input: string): string {
  try {
    return decodeURIComponent(input.replace(/\+/g, ""));
  } catch (e) {
    console.error(input.toString() + e);
    return input.toString();
  }
}

export function encode(input: string | number | boolean): string {
  try {
    return encodeURIComponent(input)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");

    // encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    //   return '%' + c.charCodeAt(0).toString(16);
    // })
  } catch (e) {
    console.error(input.toString() + e);
    return input.toString();
  }
}


export function parserQueryString(url: string): [string, Record<string, string>] {
  let res = {};

  let [ nextUrl, querystring ] = url.split("?");
  if (!querystring) {
    return [ nextUrl, res ];
  }

  let queryList = querystring.split("&");
  let key, val;
  
  queryList.forEach(ele => {
    [ key, val ] = ele.split("=");
    res[decode(key)] = decode(val);
  });

  return [ nextUrl, res ];
}


export function stringify<T = string>(maps: Record<string, T>): string {
  let res: string[] = [];
  forEach(maps, (key, val) => {
    if (val === undefined || val === null || Number.isNaN(val)) {
      val = "";
    }
    if (val instanceof Date) {
      val = val.toISOString();
    }
    if (isObject(val) || isArray(val)) {
      val = JSON.stringify(val);
    }
    let str = `${encode(key)}=${encode(val)}`;
    res.push(str);
  });

  let querystring = "";

  if (!isEmpty(res)) {
    querystring = `?${res.join("&")}`;
  }

  return querystring;
}


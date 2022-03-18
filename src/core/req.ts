import { Dic, RequestInterface, XsHeaderImpl } from "../typedef";
import { decode, encode, forEach, getType, isAbsoluteURL, isArray, isEmpty, isNode, isObject } from "../utils";
import { defaultContentType } from "../xsHeaders";


function decodeQueryString(raw: string, res = {}): Dic {
  // not be first "?"
  return raw.split("&").reduce((query, kv) => {
    let kvStack = kv.split("=");
    query[decode(kvStack.shift())] = decode(kvStack.pop());
    return query;
  }, res);
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


export function parseQueryString(opts: RequestInterface): [string, Dic] {

  let originalUrl = opts.url ?? "";
  let raw = "", sourceQuery = opts.query ?? {}, nextQuery = {};

  [ originalUrl, raw ] = originalUrl.split("?");

  if (!isAbsoluteURL(originalUrl)) {
    originalUrl = originalUrl.replace(/^\/*/, "/").replace(/\/*$/, "").replace(/\s*/g, "").replace(/#[\w\W]*/g, "");
  }

  if (typeof sourceQuery === "string") {
    nextQuery = decodeQueryString(sourceQuery);
  }
  else if (sourceQuery instanceof URLSearchParams) {
    sourceQuery.forEach((val, key) => nextQuery[decode(key)] = decode(val));
  }
  else if (isObject(sourceQuery)) {
    forEach(sourceQuery, (key, val) => nextQuery[decode(key)] = decode(val));
  }

  if (!isEmpty(raw)) {
    let parserdRawJson = decodeQueryString(raw);
    forEach(parserdRawJson, (key, val) => nextQuery[decode(key)] = decode(val));
  }

  originalUrl = `${opts.url}${stringify(nextQuery)}`;

  return [ originalUrl, nextQuery ];
}


export function transfromData(opts: RequestInterface) {
  let body = opts.body;

  // eslint-disable-next-line
  if (body == null) {
    return null;
  }
  let header = opts.headers as XsHeaderImpl;
  let contentType = header.get(defaultContentType.contentType), replaceContentType = contentType;

  switch (getType(body).toLowerCase()) {
    case "array":
    case "urlsearchparams":
    case "object": {
      if (replaceContentType?.includes("application/json") || isObject(body) || Array.isArray(body)) {
        body = JSON.stringify(body);
      }
      else {
        body = new URLSearchParams(body as URLSearchParams | Record<string, string>).toString();
      }

      if (isNode) {
        body = Buffer.from(body, "utf-8");
      }
      replaceContentType = defaultContentType.search;
      break;
    }
    case "string":
      replaceContentType = defaultContentType.text;
      break;
    case "arraybuffer": {
      if (isNode) {
        body = Buffer.from(new Uint8Array(body as ArrayBuffer));
      }
      break;
    }
    case "formdata": {
      replaceContentType = contentType = null;
      header.delete(defaultContentType.contentType);
    }
  }

  if (isEmpty(contentType) && !isEmpty(replaceContentType)) {
    header.set(defaultContentType.contentType, replaceContentType);
  }
  opts.headers = header;
  
  return body;
}
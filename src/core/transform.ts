import { isNode, isEmpty, valueOf } from "../utils";
import { RequestInterface, XsHeaderImpl } from "../typedef";
import { contentType } from "../parts/headers";
import {  forEach, isAbsoluteURL, isObject, isUndef } from "../utils";
import { ResponseStruct } from "./complete";

export function encode(input: string): string {
  try {
    return encodeURIComponent(input)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  } catch (e) {
    console.error(input.toString() + e);
    return input.toString();
  }
}


const querySerializerMap = {
  "String": query => query.replace(/^\?*/, "").replace(/&[\w\W]=$/, ""),
  "URLSearchParams": query => query.toString(),
  "Object": query => {
    let queryList = [];

    forEach(query, function each(key, val) {
      if (val === null || val === "undfefined") {
        return;
      }

      let valType = valueOf(val);

      switch (valType) {
        case "URLSearchParams":
          val = val.toString();
          break;
        case "Array":
          val = val.join();
          break;
        case "Object":
          val = JSON.stringify(val);
          break;
        default:
          val = val.toString();

          // wran to console
          break;
      }

      queryList.push(`${encode(key as string)}=${encode(val)}`);
    });

    return queryList.join("&");
  }
};

export function urlQuerySerialize(originalUrl = "", sourceQuery: Record<string | number, unknown> | URLSearchParams | string) {

  if (!isAbsoluteURL(originalUrl)) {
    originalUrl = originalUrl.replace(/^\/*/, "/").replace(/\/*$/, "").replace(/\s*/g, "").replace(/#[\w\W]*/g, "");
  }

  let hasUrlInQuery = originalUrl.lastIndexOf("?") !== -1;

  if (!isUndef(sourceQuery)) {
    let nextQueryRaw = "";

    // query -> urlSearchParams
    // query -> string
    // query -> dict
    // query -> list

    let sourceQueryType = valueOf(sourceQuery);
    let serialize = querySerializerMap[sourceQueryType];

    nextQueryRaw = serialize(sourceQuery);

    originalUrl += hasUrlInQuery ? "&" : `?${nextQueryRaw}`;
  }

  return originalUrl;
}

export function transfromRequestPayload(opts: RequestInterface) {
  let body = opts.body;

  // eslint-disable-next-line
  if (body == null) {
    return null;
  }

  let header = opts.headers as XsHeaderImpl;
  let headerType = header.get(contentType.contentType), replaceContentType = headerType;

  switch (valueOf(body).toLowerCase()) {
    case "array":
    case "urlsearchparams":
    case "object": {
      if (
        replaceContentType?.includes("application/json") &&
        (isObject(body) || Array.isArray(body))
      ) {
        body = JSON.stringify(body);
      }
      else {
        body = new URLSearchParams(body as URLSearchParams | Record<string, string>).toString();
      }

      if (isNode) {
        // node环境转换为buffer传输
        body = Buffer.from(body, "utf-8");
      }
      replaceContentType = contentType.search;
      break;
    }
    case "string":
      replaceContentType = contentType.text;
      break;
    case "arraybuffer": {
      if (isNode) {
        body = Buffer.from(new Uint8Array(body as ArrayBuffer));
      }
      break;
    }
    case "formdata": {
      replaceContentType = headerType = null;
      header.delete(contentType.contentType);
    }
  }

  if (isEmpty(contentType) && !isEmpty(replaceContentType)) {
    header.set(contentType.contentType, replaceContentType);
  }

  opts.headers = header;

  return body;
}

export function transfromResponse(responseStruct: ResponseStruct, responseType: string) {
  let response = responseStruct.response ?? "";

  switch (responseType?.toLowerCase()) {
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
      //  fetch 会默认选择会json, xhr对象支持响应json格式。所以在浏览器环境返回就可
      if (!isNode) {
        break;
      }
    /* eslint-disable no-fallthrough */
    default: {
      response = response.toString("utf-8");

      // 在node环境如果是json就parse一下
      if (typeof response === "string" && ([ "text", "utf8" ].includes(responseType) === false)) {
        try {
          response = JSON.parse(response);
        } catch (err) { }/* eslint-disable-line no-empty */
      }
    }
  }

  responseStruct.response = response;

  return responseStruct;
}
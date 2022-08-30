import { isNodePlatform, isEmpty, valueOf } from "../utils";
import type { RequestInterface, XsHeaderImpl } from "../typedef";
import { contentType } from "../headers";
import { forEach, isAbsoluteURL, isObject, isNil } from "../utils";
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
        case "Date":
          val = (val as Date).toISOString();
          break;
        default:
          val = val.toString();
          break;
      }

      queryList.push(`${encode(key as string)}=${encode(val)}`);
    });

    return queryList.join("&");
  }
};

export function urlQuerySerialize(originalUrl = "", opts: RequestInterface) {

  let sourceQuery: RequestInterface["query"] = opts.query;

  if (!isAbsoluteURL(originalUrl)) {
    originalUrl = originalUrl.replace(/^\/*/, "/").replace(/\/*$/, "").replace(/\s*/g, "");
  }

  let hasUrlInQuery = originalUrl.lastIndexOf("?") !== -1;

  if (!isNil(sourceQuery)) {
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

  let queryMatch = opts.queryMatch;

  if (Array.isArray(queryMatch)) {
    let matcherUrl = originalUrl.slice(0, originalUrl.indexOf("{") - 1);

    let matcher = null;
    let matchRe = /{[\w]+}/g;

    let end = originalUrl.length;
    let start = end;

    while ((matcher = matchRe.exec(originalUrl)) !== null) {
      matcherUrl += `/${queryMatch.shift()}`;
      start = matcher[0].length + matcher.index;
      /* eslint-disable  @typescript-eslint/no-unused-vars  */
      matcher = null;
    }

    originalUrl = matcherUrl + originalUrl.slice(start, end);
  }

  return originalUrl;
}

export function transfromRequestPayload(opts: RequestInterface) {
  let body = opts.body;

  /* eslint-disable eqeqeq */
  if (body == null) {
    return null;
  }

  let header = opts.headers as XsHeaderImpl;
  let headerContentType = header.get(contentType.contentType), replaceContentType = headerContentType;

  switch (valueOf(body).toLowerCase()) {
    case "array":
    case "urlsearchparams":
    case "object": {
      if (
        contentType.isJSON(replaceContentType) &&
        (isObject(body) || Array.isArray(body))
      ) {
        body = JSON.stringify(body);
      }
      else {
        body = new URLSearchParams(body as URLSearchParams | Record<string, string>).toString();
      }

      if (isNodePlatform) {
        body = Buffer.from(body, "utf-8");
      }

      replaceContentType = contentType.search;
      break;
    }
    case "string":
      replaceContentType = contentType.text;
      break;
    case "arraybuffer": {
      if (isNodePlatform) {
        body = Buffer.from(new Uint8Array(body as ArrayBuffer));
      }
      break;
    }
    case "formdata": {
      replaceContentType = headerContentType = null;
      header.delete(contentType.contentType);
    }
  }

  if (isEmpty(headerContentType) && !isEmpty(replaceContentType)) {
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
      if (isNodePlatform) {
        response = response.buffer;
      }
      break;
    case "text":
    case "utf8":
    case "json":
      if (!isNodePlatform) {
        break;
      }
    /* eslint-disable no-fallthrough */
    default: {
      response = response.toString("utf-8");

      // 在node环境如果是json就parse一下
      if (typeof response === "string" && ([ "text", "utf8" ].includes(responseType) === false)) {
        try {
          response = JSON.parse(response);
          /* eslint-disable no-empty */
        } catch (err) { }
      }
    }
  }

  responseStruct.response = response;

  return responseStruct;
}
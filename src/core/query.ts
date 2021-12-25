
import { encode, forEach, isAbsoluteURL, isObject, isUndef } from "../utils";

export function appendQueryToUrl(originalUrl = "", sourceQuery) {

  if (!isAbsoluteURL(originalUrl)) {
    originalUrl = originalUrl.replace(/^\/*/, "/").replace(/\/*$/, "").replace(/\s*/g, "").replace(/#[\w\W]*/g, "");
  }

  let hasUrlInQuery = originalUrl.lastIndexOf("?") !== -1;
  let nextQueryRaw = "";

  if (!isUndef(sourceQuery)) {
    // query -> urlSearchParams
    // query -> string
    // query -> dict
    if (typeof sourceQuery === "string") {
      nextQueryRaw = sourceQuery.replace(/^\?*/, "");
    }
    else if (sourceQuery instanceof URLSearchParams) {
      nextQueryRaw = sourceQuery.toString();
    }
    else if (isObject(sourceQuery)) {
      // ?todo: 注意val是数组的情况
      let queryQue = [];

      forEach(sourceQuery, (key, val) => {
        if (!isUndef(val)) {
          queryQue.push(`${encode(key)}=${encode(val)}`);
        }
      });
      nextQueryRaw = queryQue.join("&");
    }

    originalUrl += hasUrlInQuery ? "&" : `?${nextQueryRaw}`;
  }

  return originalUrl;
}

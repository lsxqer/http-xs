import { isNode } from "../utils";


export function transfromResponse(responseStruct: any, responseType: string) {
  let response = responseStruct.response;

  switch (responseType.toLowerCase()) {
    case "blob":
    case "stream":
    case "buffer":
      break;
    case "u8array":
      response =  new Uint8Array(response);
      break;
    case "arraybuffer":
      if (isNode) {
        response =  response.buffer;
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
          response =  JSON.parse(response);
        } catch (err) { }/* eslint-disable-line no-empty*/
      }
    }
  }

  responseStruct.response = response;

  return responseStruct;
}
import { isNode } from "../utils";
import { valueOf, isEmpty, isObject } from "../utils";
import { defaultContentType } from "../header";
export function transfromRequestPayload(opts) {
    let body = opts.body;
    // eslint-disable-next-line
    if (body == null) {
        return null;
    }
    let header = opts.headers;
    let contentType = header.get(defaultContentType.contentType), replaceContentType = contentType;
    switch (valueOf(body).toLowerCase()) {
        case "array":
        case "urlsearchparams":
        case "object": {
            if ((replaceContentType === null || replaceContentType === void 0 ? void 0 : replaceContentType.includes("application/json")) &&
                (isObject(body) || Array.isArray(body))) {
                body = JSON.stringify(body);
            }
            else {
                body = new URLSearchParams(body).toString();
            }
            if (isNode) {
                // node环境转换为buffer传输
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
                body = Buffer.from(new Uint8Array(body));
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
export function transfromResponse(responseStruct, responseType) {
    let response = responseStruct.response;
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
            //  fetch 会默认选择会json, xhr对象支持响应json格式。所以在浏览器环境返回就可
            if (!isNode) {
                break;
            }
        /* eslint-disable no-fallthrough */
        default: {
            response = response.toString("utf-8");
            // 在node环境如果是json就parse一下
            if (typeof response === "string" && (["text", "utf8"].includes(responseType) === false)) {
                try {
                    response = JSON.parse(response);
                }
                catch (err) { } /* eslint-disable-line no-empty */
            }
        }
    }
    responseStruct.response = response;
    return responseStruct;
}

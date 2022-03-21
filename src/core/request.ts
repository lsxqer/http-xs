import {  transfromRequestPayload } from "./transform";
import { appendQueryToUrl } from "./query";
import { RequestInterface } from "../typedef";
import {  isUndef } from "../utils";
import { XsHeaders } from "../xsHeaders";
import dispatchRequest from "./dispatchRequest";
import { transfromResponse } from "./transform";


export async function request(options: RequestInterface) {

	options.url = appendQueryToUrl(options.url, options.query);

	options.headers = XsHeaders.from(options.headers);

	options.body = transfromRequestPayload(options);

	// 分配request
	let localRequest = dispatchRequest(options);

	let responseType = options.responseType;

	// 设置默认responseType
	if (isUndef(responseType)) {
		responseType = options.responseType = options.requestName === "fetch" ? "json" : "";
	}

	// 发送请求
	let responseStruct = await localRequest(options);

	// 处理响应
	return transfromResponse(responseStruct, responseType);
}

import { parseQueryString, transfromData } from "./req";
import { RequestInterface } from "../typedef";
import {  isUndef } from "../utils";
import { XsHeaders } from "../xsHeaders";
import dispatchRequest from "./dispatchRequest";
import { transfromResponse } from "./res";


export async function request(options: RequestInterface) {

	// ~ /test?id=10 & { query: { name:"1123" } } -> /test &  { query: { name:"1123", id: 10 } }
	[ options.url, options.query ] = parseQueryString(options);

	options.headers = XsHeaders.from(options.headers);

	options.body = transfromData(options);

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

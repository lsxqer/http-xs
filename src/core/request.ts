import { transfromRequestPayload } from "./transform";
import { appendQueryToUrl } from "./query";
import { RequestInterface } from "src/typedef";
import { isUndef } from "src/utils";
import { XsHeaders } from "../header";
import { transfromResponse } from "./transform";
import dispatchRequest from "./dispatchRequest";
import { compose } from "src/compose";

export function schedulerOnSingleRequest(completeOpts: RequestInterface) {
	return compose(completeOpts.use)(completeOpts, async function requestExection(options: RequestInterface) {

		options.url = appendQueryToUrl(options.url, options.query);

		options.headers = new XsHeaders(options.headers);

		if (!isUndef(options.body)) {
			options.body = transfromRequestPayload(options);
		}

		// 分配request
		let localRequest = dispatchRequest(options);

		let responseType = options.responseType;

		// responType为空时设置默认responseType
		if (options.requestMode === "fetch") {
			if (isUndef(responseType) || responseType.trim().length === 0) {
				responseType = options.responseType = "json";
			}
		}

		// 发送请求
		let responseStruct = await localRequest(options);

		// 处理响应
		return transfromResponse(responseStruct, responseType);
	});
}

import { transfromRequestPayload } from "./transform";
import { appendQueryToUrl } from "./query";
import { RequestInterface } from "src/typedef";
import { isUndef } from "src/utils";
import { XsHeaders } from "src/xsHeaders";
import { transfromResponse } from "./transform";
import dispatchRequest from "./dispatchRequest";
import { koaCompose } from "src/compose";

export function schedulerOnSingleRequest(
	config: RequestInterface
) {
	return koaCompose(config.use)(config, async function requestExection(options: RequestInterface) {

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
	});
}

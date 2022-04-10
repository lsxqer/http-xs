var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { transfromRequestPayload } from "./transform";
import { appendQueryToUrl } from "./query";
import { isUndef } from "src/utils";
import { XsHeaders } from "../header";
import { transfromResponse } from "./transform";
import dispatchRequest from "./dispatchRequest";
import { compose } from "src/compose";
export function schedulerOnSingleRequest(completeOpts) {
    return compose(completeOpts.use)(completeOpts, function requestExection(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let responseStruct = yield localRequest(options);
            // 处理响应
            return transfromResponse(responseStruct, responseType);
        });
    });
}

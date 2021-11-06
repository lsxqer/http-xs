import { EnhanceConfig, ResponseStruct, TransformationRequest, TransformationResponse } from "./types";
import { promiseResolve, promiseReject } from "./promiseBinding";
import { isUndef } from "./utils";

export default async function fireRequest<T = any, R = ResponseStruct<T>>(pendingConfig: EnhanceConfig<TransformationRequest, TransformationResponse<R>>): Promise<R> {

  /**
   * 会调用所有请求前的函数，在config对象上取消request、req、res函数。执行之后恢复属性
   */
  let cache = {
    req: pendingConfig.transformationRequest,
    res: pendingConfig.transformationResponse,
    localRequest: null
  };

  let returnConf: EnhanceConfig<TransformationRequest, TransformationResponse>;
  let finishedConf: EnhanceConfig<null, null>;

  pendingConfig.transformationRequest = null;
  pendingConfig.transformationResponse = null;

  try {
    finishedConf = cache.req(pendingConfig as EnhanceConfig<null, null>);

    cache.localRequest = finishedConf.request;
    finishedConf.request = null;

    let response = await cache.localRequest(finishedConf);

    let finishedResponse = cache.res(response as unknown as R);

    return promiseResolve(finishedResponse);
  } catch (exx) {
    return promiseReject(exx);
  } finally {
    returnConf = finishedConf;

    if (!isUndef(returnConf)) {
      returnConf.transformationRequest = cache.req;
      returnConf.transformationResponse = cache.res;
      returnConf.request = cache.localRequest;
    }

    finishedConf = cache = returnConf = null;
  }
}
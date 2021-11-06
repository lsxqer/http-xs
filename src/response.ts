import { XsHeaderImpl, ResponseStruct, EnhanceConfig, TransformationRequest, TransformationResponse } from "./types";

export function createReject<T = any, Q extends EnhanceConfig<TransformationRequest, TransformationResponse> = EnhanceConfig<TransformationRequest, TransformationResponse>>(reject,
  requestConf: Q,
  response: T,
  header: XsHeaderImpl,
  status: number,
  statusText = "Error",
  type: ResponseStruct["type"] = "default"
) {

  let errorStruct = {
    response: response,
    headers: header,
    status: status,
    ok: status === 200,
    timeout: Number.isInteger(requestConf.timeout) ? requestConf.timeout : null,
    statusText: statusText,
    type: type,
    enhanceConfig: requestConf
  };
  return reject(errorStruct);
}

export function createResolve<T = any, Q extends EnhanceConfig<TransformationRequest, TransformationResponse> = EnhanceConfig<TransformationRequest, TransformationResponse>>(resolve,
  requestConf: Q,
  response: T,
  header: XsHeaderImpl,
  status: number,
  statusText: string,
  type: ResponseStruct["type"] = "default"
) {

  let successStruct = {
    response: response,
    headers: header,
    status: status,
    ok: status === 200,
    timeout: Number.isInteger(requestConf.timeout) ? requestConf.timeout : null,
    statusText: statusText,
    type: type,
    enhanceConfig: requestConf
  };

  return resolve(successStruct);
}

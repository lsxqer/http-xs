import { RequestInterface, XsHeaderImpl } from "../typedef";
import { NetworkType } from "./error";

export function createResolve<T = any, Q extends RequestInterface= RequestInterface>(
  resolve,
  requestConf: Q,
  response: T,
  header: XsHeaderImpl,
  status: number,
  message: string,
  type: NetworkType = "default"

) {

  let successStruct = {
    response: response,
    headers: header,
    status: status,
    ok: status === 200,
    timeout: Number.isInteger(requestConf.timeout) ? requestConf.timeout : null,
    message: message,
    type: type,
    completeConfig: requestConf
  };

  return resolve(successStruct);
}

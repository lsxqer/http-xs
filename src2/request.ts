import { requestTrnsform, responseTransform } from "./core";
import { HeaderOption, RequestInterface, RequestPayload, XsHeaderImpl } from "./typedef";
import { proxyResponse, XsReject } from "./return";
import { XsHeaders } from "src";



export default async function request<T = any, R = any>(config: RequestPayload & RequestInterface & HeaderOption) {

  try {
    let finishedConf = requestTrnsform(config);

    let returns = await finishedConf.request(finishedConf as any);

    returns.response = responseTransform(config.responseType, returns.response);

    return proxyResponse<T>(returns.response, returns.status, returns.message, returns.headers, returns.type);
  } catch (exx: any) {
    if (exx instanceof XsReject) {
      return Promise.reject(exx);
    }
    return Promise.reject(new XsReject<T, RequestPayload<null> & RequestInterface & HeaderOption<XsHeaderImpl>>({
      status: 0,
      message: exx.message,
      headers: XsHeaders.from(null, true),
      request: (config as RequestPayload<null> & RequestInterface & HeaderOption<XsHeaderImpl>),
      response: null,
      type: "error"
    }));
  }

}
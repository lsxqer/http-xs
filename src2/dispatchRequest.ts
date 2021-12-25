import { BuildRequest, HeaderOption, RequestInterface, RequestPayload, XsHeaderImpl } from "./typedef";
import { xhrRequest, fetchRequest } from "./brewer";

export interface ReturnImpl<T = any, R extends RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>  =  RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>  > {
  response: T;
  request: R;
  status: number;
  message: string;
  headers: XsHeaderImpl;
  type: any;
}

export default function dispatchRequest<
  T extends RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl> = RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>
>(config: T): BuildRequest {


  return xhrRequest;
}

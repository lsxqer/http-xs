import { HeaderOption, RequestInterface, RequestPayload, XsHeaderImpl } from "./typedef";
import { ReturnImpl } from "./dispatchRequest";
import { XsHeaders } from "./xsHeader";

export function xhrRequest<
  T extends RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>,
  R = any,
  >(opts: T): Promise<ReturnImpl<R, T>> {


  return Promise.resolve({
    response: null,
    request: opts,
    status: 0,
    message: "ss",
    headers: XsHeaders.from(null, true),
    type: "default"
  });
}

export function fetchRequest<
  T extends RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>,
  R = any,
  >(opts: T): Promise<ReturnImpl<R, T>> {



  return Promise.resolve({
    response: null,
    request: opts,
    status: 0,
    message: "ss",
    headers: XsHeaders.from(null, true),
    type: "default"
  });
}
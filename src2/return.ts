import { ReturnImpl } from "./dispatchRequest";
import { validateStatus } from "./helper";
import { HeaderOption, RequestInterface, RequestPayload, XsHeaderImpl } from "./typedef";



export class XsReject<T, R extends RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>  =  RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>> extends Error {
  status: number;
  headers: XsHeaderImpl;
  request: R;
  response: T;
  constructor(
    returns: ReturnImpl<T, R>
  ) {
    super(returns.message);
    this.headers = returns.headers;
    this.status = returns.status;
    this.request = returns.request;
    this.response = returns.response;
  }



  hasEerror = true;
  ok = false;

}


export type Return<T> = T & {
  ok: boolean;
  status: number;
  message: string;
  headers: XsHeaderImpl;
  hasError: boolean;
};

export function proxyResponse<T>(
  response: T,
  status: number,
  message: string,
  header: XsHeaderImpl,
  type: any
): Return<T> {

  let returnType = Object.prototype.toString.call(response).slice(8, -1);
  let nextResponse: any;

  switch (returnType) {
    case "String":
      nextResponse = new String(response);
      break;
    case "Number":
      nextResponse = new Number(response);
      break;
    case "Boolean":
      nextResponse = new Boolean(response);
      break;
    case "Undefined":
    case "Null":
      nextResponse = { response: null };
      break;
    default:
      nextResponse = response;
      break;
  }

  let returnProto = nextResponse.__proto__;


  nextResponse.__proto__ = {

    ok: validateStatus(status),
    message: message,
    headers: header,
    type: type,
    hasError: false,
    __proto__: returnProto
  };

  return nextResponse;
}
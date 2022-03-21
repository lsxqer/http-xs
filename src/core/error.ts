import { RequestInterface, XsHeaderImpl } from "../typedef";

export type NetworkType = ResponseType | "opaque" | "abort" | "timeout" | "status" | "client";

export class XsError<T = any, R = RequestInterface> extends Error {

  response: T = null;
  timeout: number = null;
  ok = false;

  type: NetworkType

  status: number;
  message: string;

  headers: XsHeaderImpl;
  requestConfig: R;

  constructor(
    status: number,
    message: string,
    timeout: number,
    req: R,
    headers: XsHeaderImpl,
    type: NetworkType
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.timeout = timeout;
    this.requestConfig = req;
    this.headers = headers;
    this.type = type;
  }

}
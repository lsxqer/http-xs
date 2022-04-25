import XsHeaders from "../parts/headers";
import { RequestInterface, XsHeaderImpl } from "../typedef";
import mergeConfig from "./merge";
import { exectionOfSingleRequest } from "./request";
export type NetworkType = ResponseType | "opaque" | "abort" | "timeout" | "status" | "client";

export function validateCode(status: number) {
  return status >= 200 && status < 300;
}

export function validateFetchStatus(status: number, resolve, reject) {
  return validateCode(status) ? resolve : reject;
}

export class XsError<T = any, R extends RequestInterface = RequestInterface> extends Error {

  response: T = null;
  ok = false;


  constructor(
    public status: number,
    public message: string,
    public completeConfig: R,
    public headers: XsHeaderImpl = new XsHeaders(),
    public type: NetworkType = "default"
  ) {
    super(message);
  }

  get timeout() {
    return typeof this.completeConfig.timeout === "number" ? this.completeConfig.timeout : null;
  }


  // refetch
}

export class ResponseStruct<T = any, R extends RequestInterface = RequestInterface> {

  public response: T;

  constructor(
    complete: ((argv: ResponseStruct<T> | Error) => void),
    originalResponseBody: T,

    public status: number,
    public message: string,

    public completeConfig: R,
    public type: NetworkType = "default",
    public headers: XsHeaderImpl = new XsHeaders()
  ) {

    this.response = originalResponseBody;

    complete(this);
  }

  get timeout() {
    return typeof this.completeConfig.timeout === "number" ? this.completeConfig.timeout : null;
  }

  get ok() {
    return validateCode(this.status);
  }

  private refetch(opts?: RequestInterface) {
    this.completeConfig = mergeConfig(opts, this.completeConfig) as R;
    return exectionOfSingleRequest(this.completeConfig);
  }

}


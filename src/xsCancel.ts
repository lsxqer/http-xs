
import { createXsHeader } from "./xsHeader";
import { createReject } from "./response";
import { XsCancelImpl } from "./types";


export class Singal extends EventTarget {
  aborted = false;

  addEventListener(type: string, listener: any) {
    super.addEventListener(type, listener, { once: true });
  }

}


/**
 * 用于取消一次请求
 * 拥有和`AbortController`相同的Api
 */
export class XsCancel implements XsCancelImpl {
  readonly signal = new Singal();

  abort() {
    this.signal.dispatchEvent(new Event("abort"));
    this.signal.aborted = true;
  }

}

const emptyFunc = r => r;

export function useBefore(callback) {
  return config => {
    let next = callback(config);

    if (next === false) {
      throw createReject(emptyFunc, config, null, createXsHeader(), 0, "Client Request Before Aborted", "aborted");
    }
    return next;
  };
}


export default XsCancel;

import { EnhanceConfig, ResponseStruct } from "../types";
import { createReject, createResolve } from "../response";
import { getType } from "../utils";
import { promiseReject, promiseResolve } from "../promiseBinding";
import { createXsHeader, XsHeaders } from "../xsHeader";
import { XsCancel } from "../xsCancel";

function parserRowHeader(xhr: XMLHttpRequest) {
  let head;

  if (xhr instanceof XMLHttpRequest) {
    let h = xhr.getAllResponseHeaders().trim();

    if (h.length > 0) {
      head = h.split(/\r\n/).reduce((initial, line) => {
        let [ key, val ] = line.split(":");
        initial[key] = val.trim();
        return initial;
      }, {});
    }
  }

  return createXsHeader(head, true);
}


export function xhrRequest<T = any, R = ResponseStruct<T, EnhanceConfig<null, null>>>(opts: EnhanceConfig<null, null>): Promise<R> {

  let xhr = new XMLHttpRequest();

  if (typeof opts.responseType === "string") {
    xhr.responseType = opts.responseType.toLocaleLowerCase() as XMLHttpRequestResponseType;
  }

  xhr.open(opts.method, opts.url, true, opts?.auth?.username, opts?.auth?.password);

  opts.headers.forEach((val, key) => xhr.setRequestHeader(key, val));

  if (Number.isInteger(opts.timeout)) {
    xhr.timeout = opts.timeout;
  }
  if (typeof opts.withCredentials === "boolean") {
    xhr.withCredentials = opts.withCredentials;
  }
  if (typeof opts.onProgress === "function") {
    xhr.onprogress = opts.onProgress;
  }
  if (typeof opts.onUploadProgress === "function") {
    xhr.upload.onprogress = opts.onUploadProgress;
  }
  if (typeof opts.cancel !== "undefined") {
    let abort = () => {
      opts.cancel.signal.removeEventListener("abort", abort);
      if (opts.cancel.signal.aborted) { return }
      xhr.abort();
      abort = null;
    };

    opts.cancel.signal.addEventListener("abort", abort, { once: true });
  }

  return new Promise((resolve, reject) => {
    xhr.onabort = function onAbort() {
      createReject(reject, opts, null, parserRowHeader(xhr), xhr.status, "Http-xs: Client Aborted", "aborted");
      xhr = null;
    };

    xhr.ontimeout = function onTimeout() {
      createReject(reject, opts, null, parserRowHeader(xhr), xhr.status, "Http-xs: Network Timeout", "timeout");
      xhr = null;
    };

    xhr.onerror = function onError() {
      createReject(reject, opts, null, parserRowHeader(xhr), xhr.status, "Http-xs: Network Error", "error");
      xhr = null;
    };

    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr === null || this.readyState !== 4) {
        return;
      }
      if (this.responseURL.startsWith("file:") || this.status === 0) {
        return;
      }
      createResolve(
        (this.status >= 200 || this.status <= 400) ? resolve : reject,
        opts,
        this.response,
        parserRowHeader(this),
        this.status,
        this.statusText
      );
      xhr = null;
    };

    xhr.send(opts.body as Document | Blob | BufferSource | FormData | URLSearchParams | string);
  });
}


export async function fetchRequest<T = any, R = ResponseStruct<T, EnhanceConfig<null, null>>>(opts: EnhanceConfig<null, null>): Promise<R> {

  let url = opts.url;
  let cancelController: AbortController = opts.signal;

  if (cancelController instanceof XsCancel) {
    cancelController = new AbortController();
    let abort = () => {
      opts.cancel.signal.removeEventListener("abort", abort);
      if (opts.signal.signal.aborted) { return }
      cancelController.abort();
      abort = null;
    };

    opts.signal.signal.addEventListener("abort", abort);
  }

  let header = opts.headers as any;

  if (header instanceof XsHeaders) {
    header = header.raw();
  }

  let req = new Request(url, {
    cache: opts.cache,
    credentials: opts.credentials,
    integrity: opts.integrity,
    keepalive: opts.keepalive,
    body: opts.body as BodyInit,
    method: opts.method,
    mode: opts.mode,
    headers: header,
    redirect: opts.redirect,
    referrer: opts.referrer,
    referrerPolicy: opts.referrerPolicy,
    signal: cancelController?.signal
  });

  let readBody;

  try {
    readBody = await fetch(req);

    let body = readBody.clone();

    let response = await readBody[opts.responseType]();

    let xsHeader = new XsHeaders();
    
    body.headers.forEach((val, key) => xsHeader.set(key, val));

    return createResolve(
      body.status >= 200 && body.status <= 400 ? promiseResolve : promiseReject,
      opts,
      response,
      xsHeader,
      body.status,
      body.statusText,
      body.type
    );
  } catch (exx) {
    if (getType(exx) === "DOMException") {
      return createReject(promiseReject, opts, null, createXsHeader(undefined, true), 0, `Http-xs: Client Aborted ${exx.toString()}`, "aborted");
    }
    return createReject(promiseReject, opts, null, createXsHeader(undefined, true), 0, `Http-xs: ${(exx as Error).message} ${exx.toString()}`, "error");
  }
}
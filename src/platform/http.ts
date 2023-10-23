import XsHeaders from "../headers";
import { XsError, validateFetchStatus, ResponseStruct } from "../core/complete";
// @ts-ignore
import { Stream } from "stream";
import { isStream } from "../utils";
import { asyncReject } from "../utils";
import type { ClientRequest, IncomingMessage, ClientRequestArgs, RequestInterface, XsHeaderImpl } from "../typedef";
import { HttpStatusException } from "../enums";

function getRequest(type: "http" | "https"): ClientRequest {
  if (type === "http") {
    // @ts-ignore
    return require("http").request;
  }
  // @ts-ignore
  return require("https").request;
}

export function nodeRequest<T = any>(opts: RequestInterface): Promise<ResponseStruct<T>> {

  let body = opts.body;
  let headers = opts.headers;
  let requestOptions: ClientRequestArgs;

  if (typeof opts.socketPath === "string") {
    requestOptions = { socketPath: opts.socketPath };
  }
  else {
    try {
      // @ts-ignore
      requestOptions = require("url").urlToHttpOptions(new URL(opts.url));
    } catch (exx) {
      // handle parse url errx
      return asyncReject(new XsError(HttpStatusException.Error, `[Http-Xs]: Parser Url Error ${exx.toString()}`, opts, new XsHeaders(), "error"));
    }
  }

  requestOptions.method = opts.method;

  if (opts.agent !== undefined) {
    requestOptions.agent = opts.agent;
  }
  if (typeof opts.maxHeaderSize === "number") {
    requestOptions.maxHeaderSize = opts.maxHeaderSize;
  }
  if (typeof opts.auth === "object") {
    requestOptions.auth = `${opts.auth.username}:${opts.auth.password}`;
  }

  requestOptions.headers = {};
  (headers as XsHeaderImpl).forEach(function each(val, key) {
    requestOptions.headers[key] = val;
  });

  let request;
  if (/^https:?/.test(requestOptions.protocol)) {
    request = getRequest("https");
  }
  else {
    request = getRequest("http");
  }

  return new Promise(function executor(resolve, reject) {
    const req: ClientRequest = request(requestOptions, function onRequest(res: IncomingMessage) {
      if (req.destroyed) { return }

      let chunks = [];
      let stream = res;

      let resHeader = new XsHeaders(res.headers as Record<string, string>);

      res.on("error", function onError(err) {
        res.resume();
        return reject(new XsError(HttpStatusException.Error, `[Http-Xs]: ${err.message} ${err.stack}`, opts, resHeader, "error"));
      });

      if (typeof opts.encoding !== "undefined") {
        res.setEncoding(opts.encoding);
      }
      if (opts.responseType === "stream") {
        return new ResponseStruct(
          resolve as any, stream, res.statusCode, res.statusMessage, opts, null, resHeader
        );
      }

      stream.on("data", function onData(ch) {
        chunks.push(ch);
      });

      stream.on("error", function onError(exx) {
        if (req.destroyed) { return }
        return reject(new XsError(HttpStatusException.Error, `[Http-Xs]: ${exx.message} ${exx.stack}`, opts, resHeader, "error"));
      });

      stream.on("end", function onStreameEnd() {
        // @ts-ignore
        let responseBuffer = Buffer.concat(chunks);
        return new ResponseStruct(
          validateFetchStatus(res.statusCode, resolve, reject), responseBuffer, res.statusCode, res.statusMessage, opts, null, resHeader
        );
      });
    });


    req.on("error", function onError(exx) {
      if (req.destroyed) { return }
      return reject(new XsError(HttpStatusException.Error, `[Http-Xs]: Network Error:\n${exx.message}`, opts, undefined, "error"));
    });

    if (typeof opts.timeout === "number") {
      req.setTimeout(opts.timeout, function onTimeout() {
        req.destroy();
        return reject(new XsError(HttpStatusException.Timeout, `[Http-Xs]: Network Timeout of ${opts.timeout}ms`, opts, undefined, "timeout"));
      });
    }

    if (typeof opts.cancel !== "undefined") {
      let cancel = function () {
        opts.cancel.signal.removeEventListener("abort", cancel);
        if (opts.cancel.signal.aborted) { return }
        req.destroy();
        cancel = null;
        return reject(new XsError(HttpStatusException.Cancel, "[Http-Xs]: Client Abort", opts, undefined, "abort"));
      };

      opts.cancel.signal.addEventListener("abort", cancel, { once: true });
    }

    req.on("abort", function onAbort() { reject(new XsError(HttpStatusException.Cancel, "[Http-Xs]: Client Abort", opts, undefined, "abort")) });

    if (isStream(body)) {
      (body as Stream).on("error", function onError(exx) {
        return reject(new XsError(HttpStatusException.Error, `[Http-Xs]: Request data error\n${exx.message} ${exx.stack}`, opts, undefined, "error"));
      }).pipe(req);
    }
    else {
      req.end(body);
    }
  });
}
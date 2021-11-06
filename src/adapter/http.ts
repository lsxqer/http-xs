import { createXsHeader } from "../xsHeader";
import { createReject, createResolve } from "../response";
import { Stream } from "stream";
import { ResponseStruct, ClientRequestArgs, IncomingMessage, ClientRequest, EnhanceConfig } from "../types";
import { isStream } from "../utils";
import { promiseReject } from "../promiseBinding";

function getRequest(type: "http" | "https"): ClientRequest {
  if (type === "http") {
    return require("http").request;
  }
  return require("https").request;
}

export function nodeRequest<T = any, R = ResponseStruct<T, EnhanceConfig<null, null>>>(opts: EnhanceConfig<null, null>): Promise<R> {

  let body = opts.body;
  let headers = opts.headers;
  let requestOptions: ClientRequestArgs;

  if (typeof opts.socketPath === "string") {
    requestOptions = { socketPath: opts.socketPath };
  } else {
    try {
      requestOptions = require("url").urlToHttpOptions(new URL(opts.url));
    } catch (exx) {
      // handle parse url errx
      return createReject(promiseReject, opts, null, createXsHeader(), 0, `Http-xs: Parser Url Error ${exx.toString()}`, "error");
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
  headers.forEach((val, key) => {
    requestOptions.headers[key] = val;
  });

  let request;
  if (/^http/.test(requestOptions.protocol)) {
    request = getRequest("http");
  } else {
    request = getRequest("https");
  }

  return new Promise((resolve, reject) => {
    const req: ClientRequest = request(requestOptions, (res: IncomingMessage) => {
      if (req.destroyed) { return }

      let chunks = [];
      let stream = res;

      let resHeader = createXsHeader(res.headers as Record<string, string>);

      res.on("error", function onError(err) {
        res.resume();
        return createReject(reject, opts, null, resHeader, res.statusCode, `Http-xs: ${err.message} ${err.stack}`, "error");
      });

      if (typeof opts.encoding !== "undefined") {
        res.setEncoding(opts.encoding);
      }
      if (opts.responseType === "stream") {
        return createResolve(resolve, opts, stream, resHeader, res.statusCode, res.statusMessage);
      }

      stream.on("data", function onData(ch) {
        chunks.push(ch);
      });

      stream.on("error", function onError(exx) {
        if (req.destroyed) { return }
        return createReject(reject, opts, null, resHeader, res.statusCode, `Http-xs: ${exx.message} ${exx.stack}`, "error");
      });

      stream.on("end", function onStreameEnd() {
        let responseBuffer = Buffer.concat(chunks);
        createResolve(
          res.statusCode >= 200 && res.statusCode <= 400 ? resolve : reject,
          opts,
          responseBuffer,
          resHeader,
          res.statusCode,
          res.statusMessage
        );
      });
    });

    req.on("error", function onError(exx) {
      if (req.destroyed) { return }
      createReject(reject, opts, null, createXsHeader(), 0, `Http-xs: Network Error\n${exx.message} ${exx.stack}`, "error");
    });

    if (typeof opts.timeout === "number") {
      req.setTimeout(opts.timeout, function onTimeout() {
        req.destroy();
        createReject(reject, opts, null, createXsHeader(), 0, "Http-xs: Network Timeout", "timeout");
      });
    }

    if (typeof opts.cancel !== "undefined") {
      let cancel = () => {
        opts.cancel.signal.removeEventListener("abort", cancel);
        if (opts.cancel.signal.aborted) { return }
        req.destroy();
        cancel = null;
        createReject(reject, opts, null, createXsHeader(), 0, "Http-xs: Client Aborted", "aborted");
      };
      
      opts.cancel.signal.addEventListener("abort", cancel, { once: true });
    }

    req.on("abort", () => {
      createReject(reject, opts, null, createXsHeader(), 0, "Http-xs: Client Aborted", "aborted");
    });

    if (isStream(body)) {
      (body as Stream).on("error", function onError(exx) {
        createReject(reject, opts, null, createXsHeader(), 0, `Http-xs: Request data error\n${exx.message} ${exx.stack}`, "error");
      }).pipe(req);
    } else {
      req.end(body);
    }
  });
}
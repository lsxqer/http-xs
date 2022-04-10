import XsHeaders from "../header";
import { XsError, createResolve } from "./complete";
import { isStream } from "../utils";
import { promiseReject } from "../utils";
import { validateFetchStatus } from "./validateCode";
function getRequest(type) {
    if (type === "http") {
        return require("http").request;
    }
    return require("https").request;
}
export function nodeRequest(opts) {
    let body = opts.body;
    let headers = opts.headers;
    let requestOptions;
    if (typeof opts.socketPath === "string") {
        requestOptions = { socketPath: opts.socketPath };
    }
    else {
        try {
            requestOptions = require("url").urlToHttpOptions(new URL(opts.url));
        }
        catch (exx) {
            // handle parse url errx
            return promiseReject(new XsError(0, `Http-xs: Parser Url Error ${exx.toString()}`, null, opts, new XsHeaders(), "error"));
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
    headers.forEach(function each(val, key) {
        requestOptions.headers[key] = val;
    });
    let request;
    if (/^http/.test(requestOptions.protocol)) {
        request = getRequest("http");
    }
    else {
        request = getRequest("https");
    }
    return new Promise(function executor(resolve, reject) {
        const req = request(requestOptions, function onRequest(res) {
            if (req.destroyed) {
                return;
            }
            let chunks = [];
            let stream = res;
            let resHeader = new XsHeaders(res.headers);
            res.on("error", function onError(err) {
                res.resume();
                return reject(new XsError(0, `Http-xs: ${err.message} ${err.stack}`, null, opts, resHeader, "error"));
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
                if (req.destroyed) {
                    return;
                }
                return reject(new XsError(0, `Http-xs: ${exx.message} ${exx.stack}`, null, opts, resHeader, "error"));
            });
            stream.on("end", function onStreameEnd() {
                let responseBuffer = Buffer.concat(chunks);
                createResolve(validateFetchStatus(res.statusCode, resolve, reject), opts, responseBuffer, resHeader, res.statusCode, res.statusMessage);
            });
        });
        let errorHeader = new XsHeaders();
        req.on("error", function onError(exx) {
            if (req.destroyed) {
                return;
            }
            return reject(new XsError(0, `Http-xs: Network Error\n${exx.message} ${exx.stack}`, null, opts, errorHeader, "error"));
        });
        if (typeof opts.timeout === "number") {
            req.setTimeout(opts.timeout, function onTimeout() {
                req.destroy();
                return reject(new XsError(0, `Http-xs: Network Timeout of ${opts.timeout}ms`, null, opts, errorHeader, "timeout"));
            });
        }
        if (typeof opts.cancel !== "undefined") {
            let cancel = function () {
                opts.cancel.signal.removeEventListener("abort", cancel);
                if (opts.cancel.signal.aborted) {
                    return;
                }
                req.destroy();
                cancel = null;
                return reject(new XsError(0, "Http-xs: Client Abort", null, opts, errorHeader, "abort"));
            };
            opts.cancel.signal.addEventListener("abort", cancel, { once: true });
        }
        req.on("abort", function onAbort() { reject(new XsError(0, "Http-xs: Client Abort", null, opts, errorHeader, "abort")); });
        if (isStream(body)) {
            body.on("error", function onError(exx) {
                return reject(new XsError(0, `Http-xs: Request data error\n${exx.message} ${exx.stack}`, null, opts, errorHeader, "error"));
            }).pipe(req);
        }
        else {
            req.end(body);
        }
    });
}

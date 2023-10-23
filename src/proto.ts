import { asyncIterable } from "./asyncIterator";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders from "./headers";
import { define, useRequest } from "./define";
import { forEach, asyncReject, asyncResolve } from "./utils";
import retry from "./retry";

const HttpXsDefaultProto = {
  asyncIterable: asyncIterable,
  request: exectionOfSingleRequest,
  XsCancel: XsCancel,
  XsHeaders: XsHeaders,
  resolve: asyncResolve,
  reject: asyncReject,
  each: forEach,
  retry: retry,
  define: define,
  useRequest: useRequest
};

Object.freeze(HttpXsDefaultProto);

export default HttpXsDefaultProto;

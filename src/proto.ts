import { asyncIterable } from "./parts/asyncIterator";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders, { contentType } from "./parts/headers";
import { defineInterface, deriveInterfaceWrapper } from "./parts/define";
import { copyTo, forEach, promiseReject, promiseResolve } from "./utils";
import retry from "./parts/retry";

const HttpXsDefaultProto = {
  asyncIterable: asyncIterable,
  request: exectionOfSingleRequest,
  XsCancel: XsCancel,
  XsHeaders: XsHeaders,
  contentType: { ...contentType },
  resolve: promiseResolve,
  reject: promiseReject,
  copyTo: copyTo,
  each: forEach,
  retry: retry,
  defineInterface:defineInterface,
  deriveInterfaceWrapper: deriveInterfaceWrapper
};

Object.freeze(HttpXsDefaultProto);

export default HttpXsDefaultProto;

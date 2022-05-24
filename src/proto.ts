import { asyncIterable } from "./asyncIterator";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders, { contentType } from "./headers";
import { defineInterface, deriveInterfaceWrapper } from "./define";
import { copyTo, forEach, asyncReject, asyncResolve } from "./utils";
import retry from "./retry";

const HttpXsDefaultProto = {
  asyncIterable: asyncIterable,
  request: exectionOfSingleRequest,
  XsCancel: XsCancel,
  XsHeaders: XsHeaders,
  contentType: { ...contentType },
  resolve: asyncResolve,
  reject: asyncReject,
  copyTo: copyTo,
  each: forEach,
  retry: retry,
  defineInterface:defineInterface,
  deriveInterfaceWrapper: deriveInterfaceWrapper
};

Object.freeze(HttpXsDefaultProto);

export default HttpXsDefaultProto;

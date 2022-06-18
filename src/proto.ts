import { asyncIterable } from "./asyncIterator";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import XsHeaders, { contentType } from "./headers";
import { defineInterface, applyRequest } from "./define";
import {  forEach, asyncReject, asyncResolve } from "./utils";
import retry from "./retry";

const HttpXsDefaultProto = {
  asyncIterable: asyncIterable,
  request: exectionOfSingleRequest,
  XsCancel: XsCancel,
  XsHeaders: XsHeaders,
  contentType: { ...contentType },
  resolve: asyncResolve,
  reject: asyncReject,
  each: forEach,
  retry: retry,
  defineInterface:defineInterface,
  applyRequest: applyRequest
};

Object.freeze(HttpXsDefaultProto);

export default HttpXsDefaultProto;

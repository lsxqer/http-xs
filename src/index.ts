import createInstance from "./constructor";
import { toCamelCase, XsHeaders, defaultContentType } from "./header";
import { schedulerOnSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./httpMethod";
import { applyRequest, defineInterface, RecordInterface, MethodStore, RecordMethod } from "./define";
import { HttpMethod } from "./typedef";
import { promiseResolve, promiseReject } from "./utils";

export type { RecordInterface, MethodStore, RecordMethod };

type Xs = {
  Get: HttpMethod;
  get: HttpMethod;
  Delete: HttpMethod;
  createInstance: typeof createInstance,
  delete: HttpMethod;
  Post: HttpMethod;
  post: HttpMethod;
  Put: HttpMethod;
  put: HttpMethod;
  Head: HttpMethod;
  head: HttpMethod;
  Patch: HttpMethod;
  patch: HttpMethod;
  Options: HttpMethod;
  options: HttpMethod;
  request: typeof schedulerOnSingleRequest;
  toCamelCase: typeof toCamelCase;
  XsHeaders: typeof XsHeaders;
  defaultContentType: typeof defaultContentType;
  XsCancel: typeof XsCancel;
  applyRequest: typeof applyRequest;
  defineInterface: typeof defineInterface;
  promiseReject: typeof promiseReject;
  promiseResolve: typeof promiseResolve;
}

const xs: Xs = {
  createInstance,
  Get: Get,
  get: Get,

  Delete: Delete,
  delete: Delete,

  Post: Post,
  post: Post,

  Put: Put,
  put: Put,

  Head: Head,
  head: Head,

  Patch: Patch,
  patch: Patch,

  Options: Options,
  options: Options,

  request: schedulerOnSingleRequest,

  toCamelCase, XsHeaders, defaultContentType: defaultContentType,

  XsCancel,

  applyRequest, defineInterface,

  promiseResolve: promiseResolve,
  promiseReject: promiseReject
};


export {
  xs,
  createInstance,
  Get,
  Get as get,

  Delete,
  Delete as delete,

  Post,
  Post as post,

  Put,
  Put as put,

  Head,
  Head as head,

  Patch,
  Patch as pathch,

  Options,
  Options as options,

  schedulerOnSingleRequest as request,

  toCamelCase, XsHeaders, defaultContentType,

  XsCancel,

  applyRequest, defineInterface,

  promiseResolve,
  promiseReject
};

export default xs;
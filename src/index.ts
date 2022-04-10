import createInstance from "./constructor";
import { toCamelCase, XsHeaders, defaultContentType } from "./header";
import { schedulerOnSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./core/httpMethod";
import { deriveInterfaceWrapper, defineInterface, RecordInterface, MethodStore, RecordMethod } from "./define";
import { HttpMethod } from "./typedef";
import { promiseResolve, promiseReject } from "./utils";
import { concurrent } from "./core/concurrent";
import { repeatExecution } from "./core/repeatExecution";

export type { RecordInterface, MethodStore, RecordMethod };

type Xs = {
  Get: HttpMethod;
  get: HttpMethod;
  concurrent: typeof concurrent;
  repeatExecution: typeof repeatExecution;
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
  deriveInterfaceWrapper: typeof deriveInterfaceWrapper;
  defineInterface: typeof defineInterface;
  promiseReject: typeof promiseReject;
  promiseResolve: typeof promiseResolve;
}

const xs: Xs = {
  repeatExecution, concurrent,
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

  deriveInterfaceWrapper, defineInterface,

  promiseResolve: promiseResolve,
  promiseReject: promiseReject
};


export {
  xs,
  repeatExecution, concurrent,
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

  deriveInterfaceWrapper, defineInterface,

  promiseResolve,
  promiseReject
};

export default xs;
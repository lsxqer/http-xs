import HttpXs from "./constructor";
import { createXsHeader, toCamelCase, XsHeaders, defaultContentType } from "./xsHeader";
import { request } from "./core";
import { Singal, XsCancel, useBefore } from "./xsCancel";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./httpMethod";
import { applyRequest, defineInterface, RecordInterface, MethodStore, RecordMethod } from "./define";
import { HttpMethod } from "./types";
import { promiseResolve, promiseReject } from "./promiseBinding";

export type { RecordInterface, MethodStore, RecordMethod };

type Xs = {
  HttpXs: typeof HttpXs;
  Get: HttpMethod;
  get: HttpMethod;
  Delete: HttpMethod;
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
  request: typeof request;
  createXsHeader: typeof createXsHeader;
  toCamelCase: typeof toCamelCase;
  XsHeaders: typeof XsHeaders;
  header: typeof defaultContentType;
  Singal: typeof Singal;
  XsCancel: typeof XsCancel;
  applyRequest: typeof applyRequest;
  defineInterface: typeof defineInterface;
  promiseReject: typeof promiseReject;
  promiseResolve: typeof promiseResolve;
}

const xs: Xs = {
  HttpXs: HttpXs,

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

  request: request,

  createXsHeader, toCamelCase, XsHeaders, header: defaultContentType,

  Singal, XsCancel,

  applyRequest, defineInterface,

  promiseResolve: promiseResolve,
  promiseReject: promiseReject
};


export {
  xs,
  HttpXs,

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

  request,

  createXsHeader, toCamelCase, XsHeaders, defaultContentType as header,
  
  Singal, XsCancel, useBefore,

  applyRequest, defineInterface,

  promiseResolve,
  promiseReject
};

export default HttpXs;
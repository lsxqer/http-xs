import createInstance from "./constructor";
import HttpXsDefaultProto from "./proto";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./core/httpMethod";
import { toCamelCase, XsHeaders, contentType } from "./parts/headers";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import { deriveInterfaceWrapper, defineInterface } from "./parts/define";
import { promiseResolve, promiseReject } from "./utils";
import { asyncIterable } from "./parts/asyncIterator";
import retry from "./parts/retry";

const xs = {
  ...HttpXsDefaultProto,
  create: createInstance
};

export {
  HttpXsDefaultProto,
  xs,
  retry, asyncIterable,
  createInstance as create,
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
  Patch as patch,

  Options,
  Options as options,

  exectionOfSingleRequest as request,

  toCamelCase, XsHeaders, contentType,

  XsCancel,

  deriveInterfaceWrapper, defineInterface,

  promiseResolve,
  promiseReject
};

export default xs;


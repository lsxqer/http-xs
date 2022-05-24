import createInstance from "./constructor";
import HttpXsDefaultProto from "./proto";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./core/httpMethod";
import { toCamelCase, XsHeaders, contentType } from "./headers";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import { deriveInterfaceWrapper, defineInterface } from "./define";
import { asyncResolve, asyncReject } from "./utils";
import { asyncIterable } from "./asyncIterator";
import retry from "./retry";
export * from "./typedef";

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

  asyncResolve,
  asyncReject
};

export default xs;


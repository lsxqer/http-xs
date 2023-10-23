import createInstance from "./constructor";
import HttpXsDefaultProto from "./proto";
import { Get, Post, Options, Put, Delete, Patch, Head } from "./core/httpMethod";
import { toCamelCase, XsHeaders } from "./headers";
import { exectionOfSingleRequest } from "./core/request";
import XsCancel from "./cancel";
import { useRequest, define } from "./define";
import { asyncResolve, asyncReject } from "./utils";
import { asyncIterable } from "./asyncIterator";
import retry from "./retry";
export * from "./typedef";
export * from "./enums";


const m = {
  Get, Post, Options, Put, Delete, Patch, Head,
};


const xs = {
  ...HttpXsDefaultProto,
  create: createInstance,
  ...Object.keys(m).reduce((acc, cur) => {
    let nk = cur.toLocaleLowerCase();
    acc[cur] = m[cur];
    acc[nk] = m[cur];
    return acc;
  }, {})
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

  toCamelCase,
  XsHeaders,

  XsCancel,

  useRequest, define,

  asyncResolve,
  asyncReject
};

export default xs;


import { exectionOfSingleRequest } from "src/core/request";
import mergeConfig from "./core/merge";
import XsHeaders from "./headers";
import { HttpMethod, Method, RequestInterface, ResponseStruct } from "./typedef";
import { isNil } from "./utils";

export interface RecordInterface {
  [p: string]: {
    method: Method;
    url: string;
  } & Omit<RequestInterface, "url" | "method">;
}

interface DefineExecute {
  <S = ResponseStruct<any>>(
    payload?: RequestInterface["query"] | RequestInterface["body"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "query" | "body">
  ): Promise<S>;
  <R = any, S = ResponseStruct<R>>(
    payload: RequestInterface["query"] | RequestInterface["body"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url">
  ): Promise<S>;
  executing: boolean;
  request: <S = ResponseStruct<any>>(
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method">
  ) => Promise<S>;
}

export type DefineMethod<
  T extends RecordInterface = RecordInterface
  > = {
    readonly [k in keyof T]: DefineExecute;
  };

export type RequestInput = {
  [k in Method]?: HttpMethod;
} | typeof exectionOfSingleRequest;


const notRequestBody = "get,head,trace";

/**
 * 
 * @param store {get, post, ...} 请求方法对象
 * @param record 映射对象
 * @returns 映射函数
 * 
 * @example
 * ```ts
 * const instce = new createInstance({ baseUrl:"http://api.example"});
 * 
 * const user = defineInterface(instce, {
 *  update: {
 *    method: "put",
 *    url: "/update"
 *  },
 *  delete: {
 *    method: "delte",
 *    url: "/delete"
 *  }
 * });
 * 
 * user.update({ id: 1 });
 * user.delete(id: 2);
 * 
 * const defineInterface = deriveInterfaceWrapper(instce);
 * 
 * const home = defineInterface({
 *  getHomePage: {
 *    method: "get",
 *    url: "/get-home-page"
 *  }
 * });
 * 
 * home.getHomePage({ id: 9 }).then(r => {  });
 * 
 * const list = defineInterface({
 *  getList: {
 *    method: "get",
 *    url: "/list"
 *  }
 * })
 * 
 * list.getList({ page: 1 });
 * 
 * ```
 */
export function defineInterface<
  T extends RecordInterface = RecordInterface,
  R extends DefineMethod<T> = DefineMethod<T>
>(exec: RequestInput, record: T): R {

  let entries = Object.entries(record);
  let define = {};

  for (let [ key, def ] of entries) {
    let method = def.method, url = def.url;

    const executor = (async (data?: RequestInterface["query"] | RequestInterface["body"] | null, nextConfig?: RequestInterface) => {

      executor.executing = true;

      try {
        let config = nextConfig ?? {};
        let nextHeaders: XsHeaders = null;

        if (!(isNil(config.headers) && isNil(def.headers))) {
          nextHeaders = new XsHeaders(def.headers);
          XsHeaders.forEach(config.headers, (k, v) => {
            nextHeaders.set(k, v);
          });
        }

        config = mergeConfig(nextConfig, def);

        nextHeaders !== null && (config.headers = nextHeaders);

        if (!isNil(data)) {
          if (notRequestBody.includes(method)) {
            config.query = data as RequestInterface["query"];
          }
          else {
            config.body = data;
          }
        }

        config.url = url;
        config.method = method;
        return (typeof exec === "function" ? exec(config) : exec[method](config));
      } finally {
        executor.executing = false;
      }
    }) as DefineExecute;

    executor.request = (function request(nextConfig?: RequestInterface) {
      let merged = mergeConfig(nextConfig ?? {}, def);
      merged.url = def.url;
      merged.method = def.method;
      return (typeof exec === "function" ? exec(merged) : exec[method](merged));
    } as any);

    define[key] = executor;
  }

  return define as R;
}

/**
 * 接受一个实例，返回一个函数，函数中使用实例中的方法
 * @param store {get, post, put...}
 * @returns defineInterface.bind(this,store)
 */
export function applyRequest(this: ThisType<any>, store: RequestInput) {
  return defineInterface.bind(this, store);
}

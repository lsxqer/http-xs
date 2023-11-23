import { exectionOfSingleRequest } from "src/core/request";
import mergeConfig from "./core/merge";
import type { HttpMethod, Method, RequestInterface, ResponseStruct } from "./typedef";
import { isNil } from "./utils";

export interface Executable<R> {
  (
    payload?: RequestInterface["query"] | RequestInterface["body"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "query" | "body">
  ): Promise<R>;
  send: (
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method">
  ) => Promise<R>;
  match: (
    matcher: RequestInterface["queryMatch"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method" | "queryMatch">
  ) => Promise<R>;
  query: (
    params: RequestInterface["query"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method" | "query">
  ) => Promise<R>;
  mutation: (
    body: RequestInterface["body"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method" | "body">
  ) => Promise<R>;
  executing: boolean;
}


export type DefineRequestConfig = {
  method: Method;
  url: string;
} & Omit<RequestInterface, "url" | "method">;


type SendRequest<T = any> = (completeOpts: RequestInterface) => Promise<ResponseStruct<T>>;
export type BaseRequest = {
  [k in Method]?: HttpMethod;
} | SendRequest;


const notRequireBody = "get,head,trace" as string;

function bindBaseRequest(
  fetchRemote: typeof exectionOfSingleRequest,
  mergedConfig: RequestInterface
): Executable<unknown> {

  
  async function runWithExecuting(fn: () => Promise<any>) {
    try {
      executor.executing = true;
      return await fn();
    }
    finally {
      executor.executing = false;
    }
  }

  async function executor(
    payload?: RequestInterface["query"] | RequestInterface["body"] | null,
    nextConfig?: RequestInterface
  ) {
    return runWithExecuting(
      () => {
        let config = mergeConfig(mergedConfig, nextConfig);

        if (!isNil(payload)) {
          if (notRequireBody.includes(config.method)) {
            config.query = payload as RequestInterface["query"];
          }
          else {
            config.body = payload;
          }
        }

        return fetchRemote(config);
      }
    );
  }

  executor.send = async function request(nextConfig?: RequestInterface) {
    return executor(null, nextConfig);
  };

  executor.match = async function match(matcher: (string | boolean | number)[], nextConfig?: RequestInterface) {
    return runWithExecuting(
      async () => {
        let config = mergeConfig(mergedConfig, nextConfig);
        config.queryMatch = matcher;
        return  fetchRemote(config);
      }
    );
  };

  executor.query = async function query(payload: RequestInterface["query"], nextConfig?: RequestInterface) {
    return runWithExecuting(
      async () => {
        let config = mergeConfig(mergedConfig, nextConfig);
        config.query = payload;
        return  fetchRemote(config);
      }
    );
  };

  executor.mutation = async function (data: RequestInterface["body"], nextConfig?: RequestInterface) {
    return runWithExecuting(
      async () => {
        let config = mergeConfig(mergedConfig, nextConfig);
        config.body = data;
        return fetchRemote(config);
      }
    );
  };

  executor.executing = false;

  return executor as Executable<unknown>;
}


/**
 * 
 * @param baseRequest {get, post, ...} 请求方法对象
 * @param entry 映射对象
 * @returns 映射函数
 * 
 * @example
 * ```ts
 * const instce = new createInstance({ baseUrl:"http://api.example"});
 * 
 * const user = define(instce, {
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
 * const define = useRequest(instce);
 * 
 * const home = define({
 *  getHomePage: {
 *    method: "get",
 *    url: "/get-home-page"
 *  }
 * });
 * 
 * home.getHomePage({ id: 9 }).then(r => {  });
 * 
 * const list = define({
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
export function define<P extends Record<string, DefineRequestConfig> = Record<string, DefineRequestConfig>>(exec: BaseRequest, defines: P): { [p in keyof P]: Executable<ResponseStruct<unknown>> };
export function define<T extends Record<string, unknown>>(exec: BaseRequest, defines: { [p in keyof T]: DefineRequestConfig }): { [p in keyof T]: Executable<T[p]> };
export function define(exec: BaseRequest, defines: Record<string, DefineRequestConfig>): any {

  let entries = Object.entries(defines);
  let define = {};

  for (let [ key, def ] of entries) {
    let method = def.method;

    define[key] = bindBaseRequest(
      typeof exec === "function" ? exec : exec[method],
      def
    );
  }

  return define;
}

/**
 * 接受一个实例，返回一个函数，函数中使用实例中的方法
 * @param baseRequest {get, post, put...}
 * @returns define.bind(this,baseRequest)
 */
export function useRequest(this: ThisType<any>, baseRequest: BaseRequest): UseRequest {
  return define.bind(this, baseRequest) as UseRequest;
}


export interface UseRequest {
  <P extends Record<string, DefineRequestConfig> = Record<string, DefineRequestConfig>>(defines: P): { [p in keyof P]: Executable<ResponseStruct<unknown>> };
  <T extends Record<string, unknown>>(defines: { [p in keyof T]: DefineRequestConfig }): { [p in keyof T]: Executable<T[p]> };
}


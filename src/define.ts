import { exectionOfSingleRequest } from "src/core/request";
import mergeConfig from "./core/merge";
import type { HttpMethod, Method, RequestInterface, ResponseStruct } from "./typedef";
import { isNil } from "./utils";

export interface RequestEntry {
  [k: string]: {
    method: Method;
    url: string;
  } & Omit<RequestInterface, "url" | "method">;
}

interface DefineExecute {
  <S = ResponseStruct<any>>(
    payload?: RequestInterface["query"] | RequestInterface["body"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "query" | "body">
  ): Promise<S>;
  send: <S = ResponseStruct<any>>(
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method">
  ) => Promise<S>;
  match: <S = ResponseStruct<any>>(
    matcher: RequestInterface["queryMatch"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method" | "queryMatch">
  ) => Promise<S>;
  query: <S = ResponseStruct<any>>(
    params: RequestInterface["query"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method" | "query">
  ) => Promise<S>;
  mutation: <S = ResponseStruct<any>>(
    body: RequestInterface["body"],
    nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method" | "body">
  ) => Promise<S>;
  executing: boolean;
}

export type DefineMethod<
  T extends RequestEntry = RequestEntry
> = {
    readonly [k in keyof T]: DefineExecute;
  };

type SendRequest<T = any> = (completeOpts: RequestInterface) => Promise<ResponseStruct<T>>;
export type BaseRequest = {
  [k in Method]?: HttpMethod;
} | SendRequest;


const notRequireBody = "get,head,trace" as string;

function bindBaseRequest(
  fetchRemote: typeof exectionOfSingleRequest,
  mergedConfig: RequestInterface
): DefineExecute {

  async function executor(
    payload?: RequestInterface["query"] | RequestInterface["body"] | null,
    nextConfig?: RequestInterface
  ) {
    return runWithExecuting(
      async () => {
        let config = mergeConfig(mergedConfig, nextConfig);

        if (!isNil(payload)) {
          if (notRequireBody.includes(config.method)) {
            config.query = payload as RequestInterface["query"];
          }
          else {
            config.body = payload;
          }
        }

        return await fetchRemote(config);
      }
    );
  }

  async function runWithExecuting(fn: () => Promise<any>) {
    try {
      executor.executing = true;
      return await fn();
    }
    finally {
      executor.executing = false;
    }
  }

  executor.send = async function request(nextConfig?: RequestInterface) {
    return executor(null, nextConfig);
  };

  executor.match = async function match(matcher: (string | boolean | number)[], nextConfig?: RequestInterface) {
    return runWithExecuting(
      async () => {
        let config = mergeConfig(mergedConfig, nextConfig);
        config.queryMatch = matcher;
        return await fetchRemote(config);
      }
    );
  };

  executor.query = async function query(payload: RequestInterface["query"], nextConfig?: RequestInterface) {
    return runWithExecuting(
      async () => {
        let config = mergeConfig(mergedConfig, nextConfig);
        config.query = payload;
        return await fetchRemote(config);
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

  return executor as DefineExecute;
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
 * const defineInterface = applyRequest(instce);
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
  T extends RequestEntry = RequestEntry,
  R extends DefineMethod<T> = DefineMethod<T>
>(exec: BaseRequest, entry: T): R {

  let entries = Object.entries(entry);
  let define = {};

  for (let [key, def] of entries) {
    let method = def.method;

    define[key] = bindBaseRequest(
      typeof exec === "function" ? exec : exec[method],
      def
    );
  }

  return define as R;
}

/**
 * 接受一个实例，返回一个函数，函数中使用实例中的方法
 * @param baseRequest {get, post, put...}
 * @returns defineInterface.bind(this,baseRequest)
 */
export function applyRequest(this: ThisType<any>, baseRequest: BaseRequest) {
  return defineInterface.bind(this, baseRequest);
}

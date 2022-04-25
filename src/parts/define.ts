import { HttpMethod, Method, RequestInterface, ResponseStruct, UseMidware } from "../typedef";

export interface RecordInterface {
  [p: string]: {
    method: Method,
    url: string
    [key: string]: unknown
  }
}

export type RecordMethod<T extends RecordInterface = RecordInterface> = {
  readonly [k in keyof T]: {
    <F = any, R = ResponseStruct<F>>(data?: RequestInterface["query"] & RequestInterface["body"], config?: Exclude<Partial<RequestInterface>, "url">): Promise<R>;
    loading: boolean;
  };
};

export type MethodStore = {
  [k in Method]?: HttpMethod
}

const payloadMethod = "post,put,patch";

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
export function defineInterface(store: MethodStore, record: RecordInterface): RecordMethod {
  return Object.entries(record).reduce((result, [ key, methodConf ]): RecordMethod => {

    let method = methodConf.method.toLowerCase();

    const executor = ((data, config?: RequestInterface) => {

      config ??= {};

      // merge default query
      if (payloadMethod.includes(method)) {
        config.body ??= data;
      }
      else {
        config.query ??= data;
      }

      config.url = methodConf.url;

      let hasInterceptor = Array.isArray(config.interceptor);
      let interceptor = (hasInterceptor ? config.interceptor : [ config.interceptor ].filter(Boolean)) as UseMidware[];

      let loading = async (req, next) => {

        executor.loading = true;
        let res = await next();
        executor.loading = false;

        let i = 0;
        while (i < interceptor.length) {
          if (interceptor[i] === loading) {
            interceptor.splice(i, 1);
            loading = null;
            break;
          }
          i++;
        }

        if (!hasInterceptor) {
          delete config.interceptor;
        }

        return res;
      };

      interceptor.push(loading);

      return store[method](config);
    }) as any;

    executor.loading = false;

    result[key] = executor;

    return result;
  }, {});
}

/**
 * 接受一个实例，返回一个函数，函数中使用实例中的方法
 * @param store {get, post, put...}
 * @returns defineInterface
 */
export function deriveInterfaceWrapper(this: ThisType<any>, store: MethodStore) {
  return defineInterface.bind(this, store);
}


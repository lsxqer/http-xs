import { HttpMethod, Method, RequestInterface, ResponseStruct } from "./types";

export interface RecordInterface {
  [p: string]: {
    method: Method,
    url: string
    [key: string]: unknown
  }
}

export type RecordMethod<T extends RecordInterface = RecordInterface> = {
  readonly [k in keyof T]: <F = any, R = ResponseStruct<F>> (config: Exclude<Partial<RequestInterface>, "url">) => Promise<R>
};

export type MethodStore = {
  [k in Method]?: HttpMethod
}

/**
 * 
 * @param store {get, post, ...} 请求方法对象
 * @param record 映射对象
 * @returns 映射函数
 * 
 * @example
 * ```ts
 * const httpXs = new HttpXs({ baseUrl:"http://api.example"});
 * 
 * const user = defineInterface(httpXs, {
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
 * const defineInterface = createDefineApi(httpXs);
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
    result[key] = store[methodConf.method].bind(store, methodConf.url);
    return result;
  }, {});
}

/**
 * 接受一个实例，返回一个函数，函数中使用实例中的方法
 * @param store {get, post, put...}
 * @returns defineInterface
 */
export function applyRequest(this: any, store: MethodStore) {
  return defineInterface.bind(this, store);
}


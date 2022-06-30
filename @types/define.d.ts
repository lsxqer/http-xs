import { exectionOfSingleRequest } from "src/core/request";
import { HttpMethod, Method, RequestInterface, ResponseStruct } from "./typedef";
export interface RecordInterface {
    [p: string]: {
        method: Method;
        url: string;
    } & Omit<RequestInterface, "url" | "method">;
}
interface DefineExecute {
    <S = ResponseStruct<any>>(payload?: RequestInterface["query"] | RequestInterface["body"], nextConfig?: Exclude<Partial<RequestInterface>, "url" | "query" | "body">): Promise<S>;
    <R = any, S = ResponseStruct<R>>(payload: RequestInterface["query"] | RequestInterface["body"], nextConfig?: Exclude<Partial<RequestInterface>, "url">): Promise<S>;
    executing: boolean;
    request: <S = ResponseStruct<any>>(nextConfig?: Exclude<Partial<RequestInterface>, "url" | "method">) => Promise<S>;
}
export declare type DefineMethod<T extends RecordInterface = RecordInterface> = {
    readonly [k in keyof T]: DefineExecute;
};
export declare type RequestInput = {
    [k in Method]?: HttpMethod;
} | typeof exectionOfSingleRequest;
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
export declare function defineInterface<T extends RecordInterface = RecordInterface, R extends DefineMethod<T> = DefineMethod<T>>(exec: RequestInput, record: T): R;
/**
 * 接受一个实例，返回一个函数，函数中使用实例中的方法
 * @param store {get, post, put...}
 * @returns defineInterface.bind(this,store)
 */
export declare function applyRequest(this: ThisType<any>, store: RequestInput): (record: RecordInterface) => DefineMethod<RecordInterface>;
export {};

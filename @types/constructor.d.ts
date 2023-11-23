import { UseRequest } from "./define";
import HttpXsDefaultProto from "./proto";
import type { RequestUseCallback, Method, RequestInterface, HttpMethod, CustomRequest } from "./typedef";
interface RequestInstanceInterface {
    /**
     * 实例拦截器
     */
    interceptors?: RequestUseCallback<any>[];
    /**
     * 实例共享headers
     */
    headers?: RequestInterface["headers"];
    /**
     * 超时时间
     */
    timeout?: number;
    /**
     * 共享url
     */
    baseUrl?: string;
    /**
     * 实例响应类型
     */
    responseType?: RequestInterface["responseType"];
    /**
     * fetch｜xhr
     */
    requestMode?: RequestInterface["requestMode"];
    /**
     * 自定义请求执行函数
     */
    customRequest?: CustomRequest;
}
interface UseFunction<R = Instance> {
    <T = any>(fn: RequestUseCallback<T>): R;
    <T = any>(fns: RequestUseCallback<T>[]): R;
    <T = any>(...fns: RequestUseCallback<T>[]): R;
    delete(fn: RequestUseCallback<any>): boolean;
}
type Instance = Omit<typeof HttpXsDefaultProto, "define"> & {
    [key in Method]: HttpMethod;
} & {
    use: UseFunction;
    define: UseRequest;
};
declare function createInstance(defaultInstaceConfig?: RequestInstanceInterface): Instance;
export { createInstance };
export default createInstance;

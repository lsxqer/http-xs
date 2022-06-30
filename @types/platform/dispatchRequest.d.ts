import { RequestInterface, ResponseStruct } from "../typedef";
/**
 * 根据不同情况返回所支持的函数
 * @param config  请求配置
 * @returns request 一个用于执行请求的函数
 */
export default function dispatchRequest(config: RequestInterface): <T = any>(opts: RequestInterface) => Promise<ResponseStruct<T>>;

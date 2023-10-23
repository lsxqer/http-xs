
import type { Agent, ClientRequest, ClientRequestArgs, IncomingMessage } from "http";
import { ReadStream } from "fs";
import { ResponseStruct } from "./core/complete";

export type { ClientRequestArgs, ClientRequest, IncomingMessage };


export interface RequestUseCallback<UR = RequestInterface> {
  (req: RequestInterface, next: <Res = any, T = ResponseStruct<Res>>() => Promise<T>): UR | Promise<UR>;
}

export type { ResponseStruct };

export type Method = "post" | "get" | "put" | "delete" | "head" | "options" | "patch"
export type PromiseFunction<T> = (...args: any) => Promise<T>;


export interface XsHeaderImpl {
  append(name: string, value: string): void
  delete(name: string): void
  get(name: string): string | null
  set(name: string, value: string): void
  has(name: string): boolean
  forEach(callback: (value: string, key: string, parent?: XsHeaderImpl) => void, thisArg?: any): void
}


export interface CustomRequest<Q extends RequestInterface = RequestInterface, R extends ResponseStruct = ResponseStruct> {
  (req: Q): Promise<R>;
}
// type Buffer = any;
// type BufferEncoding = any;
export interface RequestInterface {

  /**
    * url - 请求的具体路径
    */
  url?: string;

  /**
   *
   * method - 请求的方式 { "get", "post", ...}
   */
  method?: Method;

  /**
    * headers - 请求头信息
    *  - object
    *  - [string, string] []
    *  - Headers
    *  - XsHeaders
    *   !XsHeaders 为内部构造对象，方便使用，解决浏览器和node平台的差异。 推荐使用
    */
  headers?: Record<string, string> | [string, string][] | XsHeaderImpl;

  /**
   * query - 作为请求url的查询参数
   *   - object
   *   - string
   *   - URLSearchParams
   */
  query?: Record<string, unknown> | string | URLSearchParams;

  /**
   * queryMatch - 动态路由
   *    /query/{id} -> /query/123
   */
  queryMatch?: (string | boolean | number)[];
  /**
   * body - fetch、xhr、node 平台支持的请求体
  */
  body?: string | URLSearchParams | Blob | BufferSource | unknown[] | FormData | null | Record<string, unknown> | Uint8Array | ReadStream
  | Buffer;

  /**
   * cancel - 取消请求的接口
   *
   * @example
   * ```ts
   * const cancel = new XsCancel();
   * 
   * const reqConf = { cancel : cancel };
   * cancel.abort() // 取消
   * ```
   */
  cancel?: XsCancelImpl;

  /**
   * responseType - 响应类型， 由 xhr、fetch、node各个api的支持
   */
  responseType?:

  // node
  | "utf8"
  | "buffer"
  | "u8array"
  | "stream"

  // browser
  | "formData"
  | "arrayBuffer"
  | "json"
  | "blob"
  | "text"
  | "";

  /**
   * timeout - 超时等待毫秒数。默认为0
   */
  timeout?: number;

  /**
   * onProgress - 接受响应事件
   */
  onProgress?: (event: ProgressEvent) => void;

  /**
   * onUploadProgress - 上传进度事件
   */
  onUploadProgress?: (event: ProgressEvent) => void;

  /**
   * withCredentials xhr 对象的熟悉感， 是否允许跨域
   */
  withCredentials?: boolean;

  /**
   * 请求前后做点什么
   */
  interceptor?: RequestUseCallback<any> | RequestUseCallback<any>[];

  /**
   * requestMode 在浏览器端选用发送本次请求的对象
   */
  requestMode?: "xhr" | "fetch";

  // fetch
  /**
   * RequestInit 对象的配置
   * @link https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request
   */
  cache?: RequestCache;
  credentials?: RequestCredentials;
  integrity?: string;
  keepalive?: boolean;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortController;

  // node
  /**
   * request 函数的配置项
   * @link http://nodejs.cn/api/http.html#http_http_request_url_options_callback
   */
  family?: number;

  // @default 8192
  maxHeaderSize?: number;
  auth?: null | { username: string, password: string };
  localAddress?: string;
  socketPath?: string;
  agent?: Agent | boolean;

  /**
   * encoding - node, 设置响应的编码格式
   */
  encoding?: BufferEncoding;

  /**
   * customRequest - 自定义请求函数
   */
  customRequest?: CustomRequest;
}

export interface IXsEventTarget {
  addEventListener(type: string, listener: (event: any) => void, opts?: Record<string, unknown>): void;
  dispatchEvent(event: any): void;
  removeEventListener(type: string, listener: (event: any) => void);
}

export interface XsCancelImpl {
  signal: IXsEventTarget & {
    aborted: boolean;
  };
  abort(): void;
}


/**
 * 一个泛型用于http常见请求方法的接口， 比如{"get", "post", "put"}
 *   - (url) => Promise
 *   - (config) => Promise
 *   - (url, config) => Promise
 */
export interface HttpMethod {
  <T = any, R = ResponseStruct<T>>(url: string): Promise<R>;
  <T = any, R = ResponseStruct<T>>(config: Partial<RequestInterface>): Promise<R>;
  <T = any, R = ResponseStruct<T>>(url: string, config: Partial<RequestInterface>): Promise<R>;
}
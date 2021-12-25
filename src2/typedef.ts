

import { Agent, ClientRequest, ClientRequestArgs, IncomingMessage } from "http";
export { ClientRequest, IncomingMessage };
export type { ClientRequestArgs };
import { ReadStream } from "fs";
import { ReturnImpl } from "./dispatchRequest";

export type Method = "post" | "get" | "put" | "delete" | "head" | "options" | "patch";

export interface XsEventTargetImpl {
  addEventListener(type: string, listener: (event: any) => void, opts?: Record<string, unknown>): void;
  dispatchEvent(event: any): void;
  removeEventListener(type: string, listener: (event: any) => void);
}

export interface XsCancelImpl {
  readonly signal: XsEventTargetImpl & {
    aborted: boolean;
  };
  abort(): void;
}



export interface XsHeaderImpl {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  set(name: string, value: string): void;
  has(name: string): boolean;
  forEach(callback: (value: string, key: string, parent?: XsHeaderImpl) => void, thisArg?: any): void;
}

export interface BuildRequest<T extends  RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl>  =  RequestInterface & RequestPayload<null> & HeaderOption<XsHeaderImpl> > {
  // <T = any, R = any>(config: any): Promise<R>;
  (config:T) : Promise<ReturnImpl>
}


export interface RequestPayload<
  Q = Record<string, unknown> | string | URLSearchParams | undefined,
  B = string | URLSearchParams | Blob | BufferSource | FormData | null | Record<string, unknown> | Uint8Array | ReadStream | Buffer | undefined
  > {

  /**
   * query - 作为请求url的查询参数
   *   - object
   *   - string
   *   - URLSearchParams
   */
  query: Q;

  /**
   * body - fetch、xhr、node 平台支持的请求体
   */
  body: B;
}

export interface HeaderOption<H = Record<string, string> | [string, string][] | XsHeaderImpl> {
  /**
    * headers - 请求头信息
    *  - object
    *  - [string, string] []
    *  - Headers
    *  - XsHeaders
    *   !XsHeaders 为内部构造对象，方便使用，解决浏览器和node平台的差异。 推荐使用
    */
  headers?: H;

}

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
   * transformationRequest - 请求转换处理函数
   *  - transformationRequest
   *  - transformationRequest[]
   */
  // transformationRequest?: R;

  /**
   * TransformationResponse - 用户响应数据的转换属性
   *  - TransformationResponse
   *  - TransformationResponse [ ]
   */
  // transformationResponse?: P;

  /**
   * type 在浏览器端选用发送本次请求的对象
   */
  type?: "xhr" | "fetch";

  /**
   *  request - 自定义请求的函数。接受一个options。需要返回一个Response
   */
  request?: BuildRequest;

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
  auth?: null | { username: string, password: string; };
  localAddress?: string;
  socketPath?: string;
  agent?: Agent | boolean;

  /**
   * encoding - node, 设置响应的编码格式
   */
  encoding?: BufferEncoding;

}



export interface ResponseStruct<T = any, R = any> {

  /**
   * response - 具体响应数据
   */
  response: T;

  /**
   * ok - 本次请求是否成功
   */
  ok: boolean;

  /**
   * status - 本次请求的状态码
   *  也可能请求未被处理
   */
  status: number;

  /**
   * statusText - 请求响应的描述信息
   */
  statusText: string;

  /**
   * timeout - 响应时间
   */
  timeout: number;

  /**
   * type - 响应的类型
   *  - default -> basic
   */
  type: ResponseType | "opaque" | "aborted" | "timeout" | "status" | "client";

  /**
   * headers - 请求响应头
   *  - 参考请求头的headers选择
   */
  headers: XsHeaderImpl;

  /**
   * enhanceConfig - 本次请求最终使用到的请求参数
   */
  enhanceConfig: R;
}



/**
 * 一个泛型用于http常见请求方法的接口， 比如{"get", "post", "put"}
 *   - (url) => Promise
 *   - (config) => Promise
 *   - (url, config) => Promise
 */
 export interface HttpMethod {
  <T = any, R = ResponseStruct<T>>(url: string): Promise<R>
  <T = any, R = ResponseStruct<T>>(config: Partial<RequestInterface>): Promise<R>
  <T = any, R = ResponseStruct<T>>(url: string, config: Partial<RequestInterface>): Promise<R>
}
## HttpXs
  采用Promise方式实现，主要用于项目Api同一管理
  
  支持前、后置转换处理函数请求取消、请求超时、请求预处理、上传下载事件监听，请求响应参数默认处理
  
  在node环境中默认采用`http、https`处理，浏览器环境可手动指定使用`fetch、xhr` 对象。默认为`fetch`

## Options
### request
```ts
export interface RequestInterface {

  /**
    * url - 请求的具体路径
    */
  url?: string
  /**
   *
   * method - 请求的方式 { "get", "post", ...}
   */
  method?: Method
  /**
    * headers - 请求头信息
    *  - object
    *  - [string, string] []
    *  - Headers
    *  - XsHeaders
    *   !XsHeaders 为内部构造对象，方便使用，解决浏览器和node平台的差异。 推荐使用
    */
  headers?: Record<string, string> | [string, string][] | XsHeaderImpl
  /**
   * query - 作为请求url的查询参数
   *   - object
   *   - string
   *   - URLSearchParams
   */
  query?: Record<string, unknown> | string | URLSearchParams
  /**
   * body - fetch、xhr、node 平台支持的请求体
   */
  body?: string | URLSearchParams | Blob | BufferSource | FormData | null | Record<string, unknown> | Uint8Array | ReadStream | Buffer
  /**
   * cancel - 取消请求的接口
   *
   * @example
   * ```ts
   * const cancel = new XsCancel();
   * 
   * const reqConf = { cancel : cancel };
   * 
   * cancel.abort() // 取消
   * ```
   */
  cancel?: XsCancelImpl

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
  | ""

  /**
   * timeout - 请求超时时间
   */
  timeout?: number

  /**
   * onProgress - 接受响应事件
   */
  onProgress?: (event: ProgressEvent) => void
  /**
   * onUploadProgress - 上传进度事件
   */
  onUploadProgress?:(event: ProgressEvent) => void
  /**
   * withCredentials xhr 对象的熟悉感， 是否允许跨域
   */
  withCredentials?: boolean
  /**
   * 请求中间函数
   */
  use?: UseMidware[]
  /**
   * requestMode 在浏览器端选用发送本次请求的对象
   */
  requestMode?: "xhr" | "fetch"
 
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
  signal?: AbortController

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
}
```
### Response
```ts
interface ResponseStruct {
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

```

### 实例选项
```ts

interface BaseConfig {
  /**
   * timeout - 该实例下所有请求的延迟毫秒
   */
  readonly timeout?: number
  /**
   * headers - 该实例下所有请求的公共请求头; 优先级 ⬇
   *   * befor > transformation > Url.Headers > baseConfig.headers
   */
  readonly headers?: Record<string, string> | [string, string][] | XsHeadersInterface | Headers
  /**
   * baseUrl - 该实例下所有请求的url会和该属性和并
   * @example
   * ```ts
   * const xs = new HttpXs( { baseUrl : "http://localhost:8090" } )
   * xs.get("/query") // url -> http://localhost:8090/query
   * ...
   * ```
   */
  readonly baseURL?: string
  /**
   * transformationRequest - 该实例下所有请求参数会共享该函数
   */
  transformationRequest?: TransformationRequest | TransformationRequest[]
  /**
   * transformationResponse - 该实例下所有响应数据会共享该函数
   */
  transformationResponse?: TransformationResponse<R> | TransformationResponse<R>[]
}
```

### 引入
1. cjs
```ts
const { HttpXs } = require("http-xs");
```
2. esm
```ts
import HttpXs, { HttpXs } from "http-xs";
```
3. script
```html
<script src="./http-xs"></script>
<script>
  const { HttpXs } = globalThis.xs;
</script>

```
### 创建一个实例

```ts
   
const xs = new HttpXs({});

  xs.get("/query?id=1")
        .then(res => /* response... */);

  xs.get("/query" { query: {id:10} })
      .then(res => /* response... */);

  xs.post("/save-user",{ body: {name:"大炮"}})
    .then(res => /* response... */);

  xs.post({
    url:"svae-user",
    body:new FormData()
  })
    .then(res => /* response... */);

```

### 请求、响应预处理
```ts
const xs = new HttpXs({});

//! s所有的请求、响应预处理函数暂时不支持Promise

xs.useBefore([
  opts => {
    // coding...
    return opts;
  },
  opts => {
    opts.headers.set("Content-Type", "application/json");
    return opts;
  },
  opts => {
    if (!global.isUserLogin) {
      throw new Error("取消请求")
    }
    return opts;
  },
  opts => {s
    setLoading(true);
    return opts;
  }
]);

xs.useAfter([
  res => {
    setLoading(false);
    return res;
  };
  res => {
    if (res.ok) {
      url.replace('xxx');
    }
    return res;
  }
]);

```

### HttpMethod
* Get
* Post
```ts
import { Get, Post } from "http-xs;

Get(url)
  .then(res => { });

Get({ /* options */ })
  .then(res => { });

Post(url)
  .then(res => { });

Post({ /* options */ })
  .then(res => { });

Post(url, { boyd:  { id: 10 }, type: "xhr" })
  .then(res => { });

```

### borwser upload file
```ts
  let formData = new FormData();

  formData.append("file", e.target.files[0]);
  
  Post(
    "http://localhost:8090/upload", 
      {
        body: formData, 
        onProgress:evl => {}
      }
    ).then(res => {
    console.log(res); // res.ok -> true
  });

```

### 取消请求
```ts
import { XsCancel } from "http-xs";

// 使用xs提供的类
  const cancel = new XsCancel();

  Get(url,{
    cancel:cancel
  });
  cancel.abort(); // 取消

const cancel = new AbortController();

  Post({
    url:"xx",
    cancel:cancel
  });

  cancel.abort();
```

### defineInterface
```ts
const httpXs = new HttpXs();

const user = defineInterface(httpXs,
   {
      save: {
        url :"/save-user",
        method:"post"
      },
      deleteUser: {
        url:"/delete-user",
        method:"get"
      }
   }
);

user.save(/* options */)
  .then(res => {});


user.deleteUser(/* options */)
  .then(res => {})；

const defineInterface = applyRequest(httpXs);

defineInterface({ delete:  {method: "delete" , url: "/delete" } });
```

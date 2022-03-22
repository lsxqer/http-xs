import { schedulerOnSingleRequest } from "./core/request";
import { mergeConfig } from "./exectuce";
import { HttpMethod, UseMidware, Method, RequestInterface } from "./typedef";


const methodNamed = [ "get", "post", "delete", "put", "patch", "options", "head" ] as Method[];


type XsInstance = {
  [p in Method]: HttpMethod;
} & {
  request: typeof schedulerOnSingleRequest
};

interface DefaultConfig extends RequestInterface {
  use?: UseMidware[]
}

function pushMidHandler(...args: UseMidware[]);
function pushMidHandler(mids: UseMidware[]);
function pushMidHandler(this: { defaultConfig: DefaultConfig }, ...args) {
  // 可能是10
  this.defaultConfig.use.push(...args.flat(10));
  return this;
}


// ? 再议
function createInstance(defaultInstaceConfig?: DefaultConfig): XsInstance {

  defaultInstaceConfig ??= {};
  defaultInstaceConfig.use = defaultInstaceConfig?.use ?? [];

  const proto = Object.create(null), instce = Object.create(null);

  Object.setPrototypeOf(instce, Object.setPrototypeOf(proto, {
    defaultConfig: defaultInstaceConfig,
    injectIntercept: pushMidHandler,
    request: schedulerOnSingleRequest
  }));

  methodNamed.forEach(method => {
    instce[method] = async function fetchRequest(this: { defaultConfig: DefaultConfig }, url, opts) {

      // let defaultUse = opts.use;
      // opts.use = null;
      opts = mergeConfig(this.defaultConfig, mergeConfig(url, opts), method);
      opts.use = opts.use.concat(this.defaultConfig.use);

      // copy opts -> newOpts

      return schedulerOnSingleRequest(opts);
    };
  });

  return instce;
}


type HttpXsImpl = {

  // [p in Method]: HttpMethod;
};

// 添加构造函数选择
class HttpXs implements HttpXsImpl {

  // midware: UseMidware[];

  // post: HttpMethod;
  // get: HttpMethod;
  // delete: HttpMethod;
  // put: HttpMethod;
  // patch: HttpMethod;
  // options: HttpMethod;
  // head: HttpMethod;

  // constructor() {
  //   this.midware = [];
  //   methodNamed.forEach(method => {
  //     this[method] = execuor(method, this.midware);
  //   });
  // }

  // use(...args: UseMidware[]);
  // use(midware: UseMidware[]);
  // use(...midwares) {

  //   let fns = this.midware;

  //   function push(arr: any[]) {
  //     arr.forEach(fn => {
  //       if (typeof fn === "function") {
  //         fns.push(fn);
  //       }
  //       else if (Array.isArray(fn)) {
  //         push(fn);
  //       }
  //     });
  //   }

  //   push(midwares);
  //   return this;
  // }

}


export {
  HttpXs, createInstance
};

export default HttpXs;

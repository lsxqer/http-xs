import { execuor } from "./exectuce";
import { HttpMethod, UseMidware, Method } from "./typedef";


const methodNamed = [ "get", "post", "delete", "put", "patch", "options", "head" ] as Method[];

type HttpXsImpl = {
  [p in Method]: HttpMethod;
};

// 添加构造函数选择
class HttpXs implements HttpXsImpl {

  midware: UseMidware[];

  post: HttpMethod;
  get: HttpMethod;
  delete: HttpMethod;
  put: HttpMethod;
  patch: HttpMethod;
  options: HttpMethod;
  head: HttpMethod;

  constructor() {
    this.midware = [];
    methodNamed.forEach(method => {
      this[method] = execuor(method, this.midware);
    });
  }

  use(...args: UseMidware[]);
  use(midware: UseMidware[]);
  use(...midwares) {

    let fns = this.midware;

    function push(arr: any[]) {
      arr.forEach(fn => {
        if (typeof fn === "function") {
          fns.push(fn);
        }
        else if (Array.isArray(fn)) {
          push(fn);
        }
      });
    }

    push(midwares);
    return this;
  }

}

export {
  HttpXs
};

export default HttpXs;

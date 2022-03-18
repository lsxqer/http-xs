import { exectuce } from "./exectuce";
import { HttpMethod, UseMidware, Method } from "./typedef";


const methodNamed = [ "get", "post", "delete", "put", "patch", "options", "head" ] as Method[];


type HttpXsImpl = {
  [p in Method]: HttpMethod;
};

class HttpXs implements HttpXsImpl {

   midware: UseMidware[] = [];

  post:HttpMethod;
  get:HttpMethod;
  delete:HttpMethod;
  put:HttpMethod;
  patch:HttpMethod;
  options:HttpMethod;
  head:HttpMethod;

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


methodNamed.forEach(method => {
  HttpXs.prototype[method] = (function ( url, options) {
    // eslint-disable-next-line
    // @ts-ignore
    return exectuce(method, this.midware, url, options);
  }) as HttpMethod;
});

export {
  HttpXs
};

export default HttpXs;

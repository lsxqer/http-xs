import { objectCreate } from "./utils";


interface PayloadOPt<C> {
  set(key: string, val: any): C & PayloadOPt<C>;
  has(key: string): boolean;
  delete(key: string): C & PayloadOPt<C>;
}

function bindCtx(ctx: Record<string, any>, map: Map<string, any>) {

  let ret = objectCreate<PayloadOPt<typeof ctx>, typeof ctx>(ctx);

  ret.set = function set(name: string, val: any) {
    map.set(name, val);
    return ret;
  };
  ret.has = function has(key: string) {
    return map.has(key);
  };
  ret.delete = function remove(key: string) {
    map.delete(key);
    return ret;
  };

  return ret;

}

export interface Line<T = any> {
  headers?: Map<string, any>;
  query?: Map<string, any>;
}

export class Return<T = any> {

  constructor(private readonly line: Line, private readonly promise: Promise<T>) {
  }


  then(...args: any[]) {
    // this.line.then(...args);
    this.promise.then(...args);
    return this;
  }


  finally(...args: any[]) {
    this.promise.finally(...args);
    return this;
  }

  catch(...args: any[]) {
    this.promise.catch(...args);
    return this;
  }


  header() {

    let map = this.line.headers;
    // xsheader
    if (map === undefined) {
      map = this.line.headers = new Map();
    }

    return bindCtx(this, map);
  }
  
  query() {
    let map = this.line.query;
    // url search params
    if (map === undefined) {
      map = this.line.query = new Map();
    }
    return bindCtx(this, map);
    
  }



  body() {

  }


  method() {

  }

  url() {

  }


}


import { bindPromise, Conf } from "./promise";
import { Return,Line } from "./return";
import { objectCreate } from "./utils";





function creator(): [Conf, Return] {
  const conf = objectCreate<Conf,Line>();
  // 绑定promise
  const promise = bindPromise(conf);

  return [conf, new Return(conf, promise)];
}


function defineMethod(method: any) {


  return function method<T = any>(...argv: any[]): Return<T> {


    let [conf, promise] = creator();


    setTimeout(() => {
      conf.promiseResove(1)
    }, 100);

    /* 
      合并参数， 生成实例
    
    */


    return promise;
  };
}



let get = defineMethod("get");


// .header().set("name","v").query()
console.log(
  get().then(r => {
    console.log("1223", r);
  }).header().set("1",2));
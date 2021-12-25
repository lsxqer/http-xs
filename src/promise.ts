

/**
 * 合成 map 处理set、get、getAll、forEach，delete方法
 */
export interface Conf {
  promiseResove:Function
  promiseReject:Function
}




export function bindPromise(conf:Conf) {
  return new Promise((resolve, reject) => {
    conf.promiseReject = reject;
    conf.promiseResove = resolve;
  })
}
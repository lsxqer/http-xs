/**
 *
 * @param store {get, post, ...} 请求方法对象
 * @param record 映射对象
 * @returns 映射函数
 *
 * @example
 * ```ts
 * const instce = new createInstance({ baseUrl:"http://api.example"});
 *
 * const user = defineInterface(instce, {
 *  update: {
 *    method: "put",
 *    url: "/update"
 *  },
 *  delete: {
 *    method: "delte",
 *    url: "/delete"
 *  }
 * });
 *
 * user.update({ id: 1 });
 * user.delete(id: 2);
 *
 * const defineInterface = deriveInterfaceWrapper(instce);
 *
 * const home = defineInterface({
 *  getHomePage: {
 *    method: "get",
 *    url: "/get-home-page"
 *  }
 * });
 *
 * home.getHomePage({ id: 9 }).then(r => {  });
 *
 * const list = defineInterface({
 *  getList: {
 *    method: "get",
 *    url: "/list"
 *  }
 * })
 *
 * list.getList({ page: 1 });
 *
 * ```
 */
export function defineInterface(store, record) {
    return Object.entries(record).reduce((result, [key, methodConf]) => {
        result[key] = store[methodConf.method].bind(store, methodConf.url);
        return result;
    }, {});
}
/**
 * 接受一个实例，返回一个函数，函数中使用实例中的方法
 * @param store {get, post, put...}
 * @returns defineInterface
 */
export function deriveInterfaceWrapper(store) {
    return defineInterface.bind(this, store);
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function executionRequest(fn, complete) {
    return fn().then(complete, complete);
}
export function concurrent(iterator, map) {
    return __awaiter(this, void 0, void 0, function* () {
        if (iterator instanceof Map) {
            let promiseResult = new Map();
            return new Promise(function executor(res) {
                let i = 0, len = iterator.size;
                iterator.forEach(function each(fn, key) {
                    executionRequest(fn, function onCompleate(result) {
                        promiseResult.set(key, typeof map === "function" ? map(result) : result);
                        i++;
                        if (i === len) {
                            res(promiseResult);
                        }
                    });
                });
            });
        }
        let promiseResult = Array.isArray(iterator) ? [] : {};
        return new Promise(function executor(res) {
            let keys = Array.from(Object.keys(iterator));
            let i = 0, len = keys.length;
            while (i < len) {
                i++;
                executionRequest(iterator[keys[i]], function onCompleate(result) {
                    promiseResult[keys[i]] = typeof map === "function" ? map(result) : result;
                    i++;
                    if (i === len) {
                        res(promiseResult);
                    }
                });
            }
        });
    });
}

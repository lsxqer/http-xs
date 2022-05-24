import { ResponseStruct, PromiseFunction } from "./typedef";

export default function retry<T extends PromiseFunction<ResponseStruct> = PromiseFunction<ResponseStruct>>(execution: T, retryNumer = 4) {
  return new Promise<ResponseStruct>(function executor(resolve) {
    let onComplete = res => {
      if (!res.ok && retryNumer > 0) {
        retryNumer--;
        return execution().then(onComplete, onComplete);
      }

      return resolve(res);
    };

    execution().then(onComplete, onComplete);
  });
}
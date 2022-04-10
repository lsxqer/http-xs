import { ResponseStruct, PromiseFunction } from "../typedef";


export function repeatExecution<T extends PromiseFunction<ResponseStruct> = PromiseFunction<ResponseStruct>>(num: number, execution: T): Promise<ResponseStruct> {

  num--;

  return new Promise<ResponseStruct>(function executor(resolve) {
    execution().then(function onComplete(res) {
      if (!res.ok && num > 0) {
        num--;
        return execution();
      }
      resolve(res);
    });
  });
}

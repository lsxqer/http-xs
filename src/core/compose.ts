import type { RequestInterface, RequestUseCallback } from "../typedef";
import { asyncReject, asyncResolve } from "../utils";
import { ResponseStruct } from "./complete";


export function compose(fns: RequestUseCallback[] = []) {

  return function execute(req: RequestInterface, finished: (req: RequestInterface) => Promise<ResponseStruct>) {

    let index = -1;
    let processNextArg = req;

    function run(i: number) {

      let fn = fns[i];

      let nextCallback = () => {
        nextCallback = null;
        return run(i + 1);
      };

      if (i <= index) {
        return asyncReject(new Error("next() called"));
      }

      if (fns.length === i) {
        return finished(processNextArg);
      }

      if (typeof fn !== "function") {
        return asyncResolve(processNextArg);
      }

      return asyncResolve(fn(processNextArg, nextCallback) as any)
        .then(next => {
          if (next !== undefined) {
            processNextArg = next as any;
          }

          return typeof nextCallback === "function" ? nextCallback() : processNextArg;
        });
    }

    return run(0);
  };
}


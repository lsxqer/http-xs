import { promiseReject, promiseResolve } from "./utils";
export function compose(fns = []) {
    return function execute(req, finished) {
        let index = -1;
        function run(i) {
            let fn = fns[i];
            if (i <= index) {
                return promiseReject(new Error("next() called"));
            }
            if (fns.length === i) {
                fn = finished;
            }
            if (typeof fn !== "function") {
                return promiseResolve();
            }
            return promiseResolve(fn(req, run.bind(null, i + 1)));
        }
        return run(0);
    };
}

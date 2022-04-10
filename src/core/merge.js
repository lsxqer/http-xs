import { isObject, copyTo } from "../utils";
export default function mergeConfig(url, options, method) {
    let completeOpts = {};
    if (isObject(url)) {
        copyTo(url, completeOpts);
    }
    else {
        completeOpts.url = url;
    }
    if (isObject(options)) {
        copyTo(options, completeOpts);
    }
    completeOpts.method = method;
    return completeOpts;
}

import { exectuce } from "./exectuce";
import { HttpMethod } from "./typedef";


const emptyMidware = [];

export const Get = ((url, options) => exectuce("get", emptyMidware, url, options)) as HttpMethod;

export const Post = ((url, options) => exectuce("post", emptyMidware, url, options)) as HttpMethod;


export const Delete = ((url, options) => exectuce("delete", emptyMidware, url, options)) as HttpMethod;

export const Put = ((url, options) => exectuce("put", emptyMidware, url, options)) as HttpMethod;

export const Patch = ((url, options) => exectuce("patch", emptyMidware, url, options)) as HttpMethod;

export const Options = ((url, options) => exectuce("options", emptyMidware, url, options)) as HttpMethod;

export const Head = ((url, options) => exectuce("head", emptyMidware, url, options)) as HttpMethod;

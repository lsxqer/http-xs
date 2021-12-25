import { createHttpMethod, composeConfig } from "./core";
import { Method, HttpMethod } from "./types";


export const mutationMethod: Method[] = [ "post", "put", "patch" ];
export const queryGetMethod: Method[] = [ "get", "delete", "options", "head" ];

const methodComposeConfig = composeConfig.bind(null, null);

export const Get: HttpMethod = createHttpMethod("get", methodComposeConfig);

export const Delete: HttpMethod = createHttpMethod("delete", methodComposeConfig);

export const Post: HttpMethod = createHttpMethod("post", methodComposeConfig);

export const Put: HttpMethod = createHttpMethod("put", methodComposeConfig);

export const Patch: HttpMethod = createHttpMethod("patch", methodComposeConfig);

export const Options: HttpMethod = createHttpMethod("options", methodComposeConfig);

export const Head: HttpMethod = createHttpMethod("head", methodComposeConfig);

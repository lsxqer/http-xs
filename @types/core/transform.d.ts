/// <reference types="node" />
import { RequestInterface } from "../typedef";
import { ResponseStruct } from "./complete";
export declare function encode(input: string): string;
export declare function urlQuerySerialize(originalUrl: string, opts: RequestInterface): string;
export declare function transfromRequestPayload(opts: RequestInterface): string | Record<string, unknown> | Blob | BufferSource | FormData | import("fs").ReadStream;
export declare function transfromResponse(responseStruct: ResponseStruct, responseType: string): ResponseStruct<any, RequestInterface>;

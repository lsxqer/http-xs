/// <reference types="node" />
/// <reference types="node" />
import type { RequestInterface } from "../typedef";
import { ResponseStruct } from "./complete";
export declare function encode(input: string): string;
export declare function urlQuerySerialize(originalUrl: string, opts: RequestInterface): string;
export declare function transfromRequestPayload(opts: RequestInterface): string | Record<string, unknown> | URLSearchParams | Blob | BufferSource | unknown[] | FormData | Uint8Array | import("fs").ReadStream | Buffer;
export declare function transfromResponse(responseStruct: ResponseStruct, responseType: string): ResponseStruct<any>;

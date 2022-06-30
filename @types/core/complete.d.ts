import { RequestInterface, XsHeaderImpl } from "../typedef";
export declare type NetworkType = ResponseType | "opaque" | "abort" | "timeout" | "status" | "client";
export declare function validateCode(status: number): boolean;
export declare function validateFetchStatus(status: number, resolve: any, reject: any): any;
export declare class XsError<T = any, R extends RequestInterface = RequestInterface> extends Error {
    status: number;
    message: string;
    completeConfig: R;
    headers: XsHeaderImpl;
    type: NetworkType;
    response: T;
    ok: boolean;
    code: number;
    constructor(status: number, message: string, completeConfig: R, headers?: XsHeaderImpl, type?: NetworkType);
    get timeout(): number;
    toString(): string;
    toJSON(): string;
}
export declare class ResponseStruct<T = any, R extends RequestInterface = RequestInterface> {
    status: number;
    message: string;
    completeConfig: R;
    type: NetworkType;
    headers: XsHeaderImpl;
    response: T;
    ok: boolean;
    constructor(complete: ((argv: ResponseStruct<T> | Error) => void), originalResponseBody: T, status: number, message: string, completeConfig: R, type?: NetworkType, headers?: XsHeaderImpl);
    get timeout(): number;
    private refetch;
}

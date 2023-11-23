export declare const asyncResolve: {
    (): Promise<void>;
    <T>(value: T): Promise<Awaited<T>>;
    <T_1>(value: T_1 | PromiseLike<T_1>): Promise<Awaited<T_1>>;
};
export declare const asyncReject: <T = never>(reason?: any) => Promise<T>;
export declare function valueOf(tar: unknown): string;
export declare function isObject<T = Record<string, unknown>>(tar: unknown): tar is T;
export declare function isFunction<T = (...args: any[]) => void>(tar: unknown): tar is T;
export declare function isStream(tar: any): "" | "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
export declare function isArray<R = any, T extends Array<R> = Array<R>>(tar: unknown): tar is T;
export declare const isNodePlatform: boolean;
export declare function isAbsoluteURL(url: string): boolean;
export declare function isNil<T>(tar: T): tar is null;
/**
 *
 * @param tar any
 * @returns boolean
 * @description null undefined length size size() keys
 */
export declare function isEmpty(tar: any): boolean;
export declare function forEach<T extends Record<string, unknown> | Array<unknown> = any, K extends keyof T = keyof T>(target: any, each: (key: K, val: T[K]) => void): void;

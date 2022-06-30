import { XsHeaderImpl } from "./typedef";
export declare const contentType: {
    contentType: string;
    search: string;
    json: string;
    text: string;
    isJSON(src?: string): boolean;
};
/**
 * 将`content-type` 转换为 `Content-Type`
 * @param name key
 * @returns key
 */
export declare function toCamelCase(name: string): string;
export declare class XsHeaders extends URLSearchParams implements XsHeaderImpl {
    constructor(init?: Record<string, string> | [string, string][] | XsHeaderImpl);
    static forEach(init: Record<string, string> | [string, string][] | XsHeaderImpl, each: (key: string, val: string) => void): void;
    toString(): string;
    get [Symbol.toStringTag](): string;
    [Symbol.iterator](): Generator<never, [string, string][], unknown>;
    raw(): Record<string, string>;
    get(name: string): string;
    set(name: string, value: string): void;
    append(name: string, value: string): void;
    has(name: string): boolean;
    delete(name: string): void;
    forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void;
}
export default XsHeaders;

import type { IXsEventTarget } from "../typedef";
import { IEvent } from "./event";
declare const Signal_base: any;
export default class Signal extends Signal_base implements IXsEventTarget {
    aborted: boolean;
    onabort: ((this: AbortSignal, ev: IEvent) => any) | null;
    addEventListener(type: keyof AbortSignalEventMap, listener: (...args: any[]) => void): void;
    dispatchEvent(event: IEvent): void;
    removeEventListener(type: keyof AbortSignalEventMap, listener: (...args: any[]) => void): void;
    subscribe(listener: (...args: any[]) => void): void;
}
export {};

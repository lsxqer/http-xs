export declare class XsEventTarget {
    private events;
    constructor();
    addEventListener(type: keyof AbortSignalEventMap, listener: any, ...args: any[]): void;
    dispatchEvent(event: Event): void;
    removeEventListener(type: keyof AbortSignalEventMap, listener: any): void;
}
export declare function getAdapEventTarget(): typeof XsEventTarget | {
    new (): EventTarget;
    prototype: EventTarget;
};

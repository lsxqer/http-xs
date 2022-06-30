export interface IEvent {
    type: keyof AbortSignalEventMap;
}
export declare class XsEvent<K extends keyof AbortSignalEventMap = keyof AbortSignalEventMap> implements IEvent {
    type: K;
    constructor(eventName: K);
    readonly isXsEvent = true;
}
export declare function getAdaptEvent(): IEvent;

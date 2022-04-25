

export interface IEvent {
  type: keyof AbortSignalEventMap

  // new(type: keyof AbortSignalEventMap): EventImpl;
}


export class XsEvent<K extends keyof AbortSignalEventMap = keyof AbortSignalEventMap> implements IEvent {
  type: K;

  constructor(eventName: K) {
    this.type = eventName;
  }

   readonly isXsEvent = true;
}

export function getAdaptEvent() {

  if (typeof Event !== "undefined") {
    return new Event("abort") as unknown as IEvent;
  }


  return  new XsEvent("abort");
}

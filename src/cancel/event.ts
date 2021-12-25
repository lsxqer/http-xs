

export interface EventImpl {
  type: keyof AbortSignalEventMap

  // new(type: keyof AbortSignalEventMap): EventImpl;
}

export function getEvent() {

  if (typeof Event !== "undefined") {
    return new Event("abort") as unknown as EventImpl;
  }

  class XsEvent<K extends keyof AbortSignalEventMap = keyof AbortSignalEventMap> implements EventImpl {
    type: K;

    constructor(eventName: K) {
      this.type = eventName;
    }

     readonly isXsEvent = true;
  }

  return  new XsEvent("abort");
}

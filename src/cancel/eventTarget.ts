

interface IEventEmitter {
  once(type: keyof AbortSignalEventMap, listener: (...args) => void): void;
  emit(Event): void;
  removeListener(type: keyof AbortSignalEventMap, listener: (...args) => void): void;
}


export class XsEventTarget {

  private events: IEventEmitter;

  constructor() {
    let EventEmitter = require("events");
    this.events = new EventEmitter();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  addEventListener(type: keyof AbortSignalEventMap, listener: any, ...args): void {
    this.events.once(type, listener);
  }

  dispatchEvent(event: Event): void {
    this.events.emit(event);
  }

  removeEventListener(type: keyof AbortSignalEventMap, listener: any) {
    this.events.removeListener(type, listener);
  }
}


export function getAdapEventTarget() {
  if (typeof EventTarget !== "undefined") {
    return EventTarget;
  }

  return XsEventTarget;
}
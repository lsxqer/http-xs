
import { XsCancelImpl, XsEventTargetImpl } from "./typedef";


function getEventTarget() {

  let EventEmitter = require("events");
  let events = new EventEmitter();

  class XsEventTarget {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    addEventListener(type: string, listener: any, opts?: Record<string, unknown>): void {
      events.once(type, listener);
    }
    dispatchEvent(event: any): void {
      events.emit(event.type, event);
    }
    removeEventListener(type: string, listener: any) {
      events.removeListener(type, listener);
    }
  }

  return XsEventTarget;
}


function getEvent() {

  class XsEvent {

    type: string;

    constructor(eventName: string) {
      this.type = eventName;
    }

  }

  return XsEvent;
}


let XsEventTarget: any, XsEvent;

if (typeof EventTarget !== "function") {
  XsEventTarget = getEventTarget();
}
else {
  XsEventTarget = EventTarget;
}

if (typeof Event !== "function") {
  XsEvent = getEvent();
}
else {
  XsEvent = Event;
}

export class Singal extends XsEventTarget implements XsEventTargetImpl {

  aborted = false;

  removeEventListener(type: string, listener: any) {
    super.removeEventListener(type, listener);
  }

  dispatchEvent(arg0: any) {
    super.dispatchEvent(arg0);
  }

  addEventListener(type: string, listener: any) {
    super.addEventListener(type, listener, { once: true });
  }

}


/**
 * 用于取消一次请求
 * 拥有和`AbortController`相同的Api
 */
export class XsCancel implements XsCancelImpl {
  readonly signal = new Singal();

  abort() {
    this.signal.dispatchEvent(new XsEvent("abort"));
    this.signal.aborted = true;
  }

}

export default XsCancel;

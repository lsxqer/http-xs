import { getEventTarget } from "./eventTarget";
import { XsEventTargetImpl } from "../typedef";
import { EventImpl } from "./event";


export default class Signal extends (getEventTarget() as any) implements XsEventTargetImpl {

  
  aborted = false;
  
  onabort: ((this: AbortSignal, ev: EventImpl) => any) | null;

  addEventListener(type: keyof AbortSignalEventMap, listener: (...args)=>void) {
    super.addEventListener(type, listener);
  }

  dispatchEvent(event: EventImpl) {
    super.dispatchEvent(event);
    this.onabort?.call(this as any, event);
  }

  removeEventListener(type: keyof AbortSignalEventMap, listener: (...args)=>void) {
    super.removeListener(type, listener);
  }

}


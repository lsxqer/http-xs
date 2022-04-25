import { getAdapEventTarget } from "./eventTarget";
import { IXsEventTarget } from "../typedef";
import { IEvent } from "./event";


// function Signle (this:ThisType<Object>) {
//   getAdapEventTarget().call(this);
//   (this as any).aborted = false;
//   (this as any).onabort = null;
// }


// Signle.prototype.addEventListener = function (type: keyof AbortSignalEventMap, listener: (...args)=>void) {
//   this.addEventListener(type, listener);
// }


export default class Signal extends (getAdapEventTarget() as any) implements IXsEventTarget {
  
  aborted = false;
  
  onabort: ((this: AbortSignal, ev: IEvent) => any) | null;

  addEventListener(type: keyof AbortSignalEventMap, listener: (...args)=>void) {
    super.addEventListener(type, listener);
  }

  dispatchEvent(event: IEvent) {
    super.dispatchEvent(event);
    this.onabort?.call(this as any, event);
  }

  removeEventListener(type: keyof AbortSignalEventMap, listener: (...args)=>void) {
    super.removeListener(type, listener);
  }

  subscribe(listener:(...args) => void) {
    super.addEventListener("abort", listener);
  }
  
}


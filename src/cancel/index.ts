import Signal from "./signal";
import { getAdaptEvent } from "./event";

export default class XsCancel {

  readonly signal = new Signal();

  abort() {
    if (this.signal.aborted) {
      return;
    }
    this.signal.dispatchEvent(getAdaptEvent());
    this.signal.aborted = true;
  }
}
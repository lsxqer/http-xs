import Signal from "./signal";
import { getEvent } from "./event";

export default class XsCancel {

  readonly signal = new Signal();

  abort() {
    this.signal.dispatchEvent(getEvent());
    this.signal.aborted = true;
  }

}
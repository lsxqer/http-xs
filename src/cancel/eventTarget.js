class XsEventTarget {
    constructor() {
        let EventEmitter = require("events");
        this.events = new EventEmitter();
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    addEventListener(type, listener, ...args) {
        this.events.once(type, listener);
    }
    dispatchEvent(event) {
        this.events.emit(event);
    }
    removeEventListener(type, listener) {
        this.events.removeListener(type, listener);
    }
}
export function getEventTarget() {
    if (typeof EventTarget !== "undefined") {
        return EventTarget;
    }
    return XsEventTarget;
}

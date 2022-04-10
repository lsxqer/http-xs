export function getEvent() {
    if (typeof Event !== "undefined") {
        return new Event("abort");
    }
    class XsEvent {
        constructor(eventName) {
            this.isXsEvent = true;
            this.type = eventName;
        }
    }
    return new XsEvent("abort");
}

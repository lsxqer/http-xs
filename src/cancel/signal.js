import { getEventTarget } from "./eventTarget";
export default class Signal extends getEventTarget() {
    constructor() {
        super(...arguments);
        this.aborted = false;
    }
    addEventListener(type, listener) {
        super.addEventListener(type, listener);
    }
    dispatchEvent(event) {
        var _a;
        super.dispatchEvent(event);
        (_a = this.onabort) === null || _a === void 0 ? void 0 : _a.call(this, event);
    }
    removeEventListener(type, listener) {
        super.removeListener(type, listener);
    }
}

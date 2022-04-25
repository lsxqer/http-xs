import { getAdaptEvent, XsEvent } from "../../src/cancel/event";

import { expect } from "chai";


describe("testing:Event", () => {

  test("Event", () => {
    let ev = getAdaptEvent();
    expect(ev).to.instanceOf(typeof Event === "undefined" ? XsEvent : Event);

  });
});

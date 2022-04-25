import { getAdapEventTarget} from "../../src/cancel/eventTarget";

import { expect } from "chai";


describe("testing:Event Target", () => {

  test("EventTarget", () => {
    let ev = getAdapEventTarget();
    // expect(ev instanceof EventTarget).equal(false);
    expect(ev).not.instanceOf(EventTarget)

  });
});

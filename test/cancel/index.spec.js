import XsCancel  from "../../src/cancel";

import { expect } from "chai";


describe("testing:XsCancel Class", () => {

  test("XsCancel.about is funciton", () => {
    let cancel = new XsCancel();
    expect(cancel.abort).to.instanceOf(Function);
  });
  
  test("XsCancel:signal",() => {
    let cancel = new XsCancel();

    cancel.abort();
    expect(cancel.signal.aborted).to.true;
  });
});

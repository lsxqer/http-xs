import { validateCode, validateFetchStatus, XsError, ResponseStruct } from "../../src/core/complete";

import { expect } from "chai";


describe("test:Complete", () => {


  test("complete:validateCode:200", () => {
    expect(validateCode(200)).to.be.true;
  });

  test("complete:validateCode:300", () => {
    expect(validateCode(300)).to.be.false;
  });

  test("complete:validateCode:100", () => {
    expect(validateCode(100)).to.be.false;
  });

  test("complete:validateCode:204", () => {
    expect(validateCode(204)).to.be.true;
  });

  test("complete:validateCode:400", () => {
    expect(validateCode(400)).to.be.false;
  });

  let resolve = () => { };
  let reject = () => { };

  test("complete:validateFetchStatus:200", () => {
    expect(validateFetchStatus(200, resolve, reject)).to.equal(resolve);
  });

  test("complete:validateFetchStatus:300", () => {
    expect(validateFetchStatus(300, resolve, reject)).to.equal(reject);
  });

  test("complete:validateFetchStatus:100", () => {
    expect(validateFetchStatus(100, resolve, reject)).to.equal(reject);
  });

  test("complete:validateFetchStatus:204", () => {
    expect(validateFetchStatus(204, resolve, reject)).to.equal(resolve);
  });

  test("complete:validateFetchStatus:400", () => {
    expect(validateFetchStatus(400, resolve, reject)).to.equal(reject);
  });

  test("complete:XsError", () => {
    let xsExx = new XsError(400, "客户端错误", {});
    expect(xsExx.timeout).to.be.null;
    expect(xsExx.ok).to.be.false;
    expect(xsExx.response).to.be.null;
    expect(xsExx.message).to.be.equal("客户端错误");
  });


  test("complete:ResponseStruct:null", () => {
    let res = new ResponseStruct(() => { }, null, 200, "OK", {});

    expect(res.message).to.be.equal("OK");
    expect(res.status).to.be.equal(200);
    expect(res.ok).to.be.true;
    expect(res.response).to.be.null;
    expect(res.timeout).to.be.null;
  });

  test("complete:ResponseStruct:object", () => {
    let r = { list: [1, 2, 34, 4] };
    let res = new ResponseStruct(() => { }, r, 200, "OK", {});

    expect(res.message).to.be.equal("OK");
    expect(res.status).to.be.equal(200);
    expect(res.ok).to.be.true;
    expect(res.response).to.be.equal(r);
    expect(res.response).to.deep.equal({ list: [1, 2, 34, 4] });
    expect(res.timeout).to.be.null;
  });



});


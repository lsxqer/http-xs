import HttpXs from "../src/constructor";
import * as chai from 'chai';

const expect = chai.expect;


describe("instance:use", () => {

  test("useBfeore:function", () => {
    let inst = new HttpXs();
    expect(inst.useBefore).to.be.instanceOf(Function);
  });

  test("useAfter:function", () => {
    let inst = new HttpXs();
    expect(inst.useAfter).to.be.instanceOf(Function);
  });
});


const localUrl = `http://localhost:8090`;

describe("instance:Promise", () => {

  const inst = new HttpXs({ baseURL: localUrl });

  test("inst:get", () => {
    return inst.get({
    }).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("get");
    });
  });

  test("inst:post", () => {
    return inst.post(undefined).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("post");
    });
  });

  test("inst:put", () => {
    return inst.put(null).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("put");
    });
  });

  test("inst:head", () => {
    return inst.head({}).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("head");
    });
  });

  test("inst:patch", () => {
    return inst.patch({}).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("patch");
    });
  });

  test("inst:options", () => {
    return inst.options({}).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("options");
    });
  });

  test("inst:delete", () => {
    return inst.delete({}).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("delete");
    });
  });

});


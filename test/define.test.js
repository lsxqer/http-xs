import HttpXs from "../src/constructor";
import * as chai from 'chai';
import { defineInterface, createDefineApi } from "../src/define";
const expect = chai.expect;




const localUrl = `http://localhost:8090`;

describe("Define request interface", () => {
  const httpXs = new HttpXs({ baseURL: localUrl });
  let record = {
    getHome: {
      method: "get",
      url: "/get-home"
    },
    getTableList: {
      method: "post",
      url: "/get-list"
    },
    update: {
      method: "put",
      url: "/"
    },
    delete: {
      method: "delete",
      url: "/"
    },
    options: {
      method: "options",
      url: "/"
    },
    patch: {
      method: "patch",
      url: "/"
    },
    head: {
      method: "head",
      url: "/"
    }
  };

  test("defineInterface to function", () => {

    const home = defineInterface(httpXs, record);
    expect(home.getHome).to.instanceOf(Function);
    expect(home.getTableList).to.instanceOf(Function);
  });

  test("defineInterface Response:get", () => {
    const home = defineInterface(httpXs, record);
    return home.getHome().then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("get");
    });
  });

  test("defineInterface Response:post", () => {
    const home = defineInterface(httpXs, record);
    return home.getTableList().then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("post");
    });
  });

  test("defineInterface Response:put", () => {
    const home = defineInterface(httpXs, record);
    return home.update().then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("put");
    });
  });

  test("defineInterface Response:delete", () => {
    const home = defineInterface(httpXs, record);
    return home.delete().then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("delete");
    });
  });

  test("defineInterface Response:options", () => {
    const home = defineInterface(httpXs, record);
    return home.options().then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("options");
    });
  });

  test("defineInterface Response:patch", () => {
    const home = defineInterface(httpXs, record);
    return home.patch().then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("patch");
    });
  });

  test("defineInterface Response:head", () => {
    const home = defineInterface(httpXs, record);
    return home.head().then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("head");
    });
  });

})
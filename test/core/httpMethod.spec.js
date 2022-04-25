import { expect } from "chai";
import { Get, Head, Patch,Options, Put, Delete, Post } from "../../src/core/httpMethod";
import XsHeaders from "../../src/parts/headers";

const localUrl = "http://127.0.0.1:4096";

describe("text:HttpMethod", () => {

  test("method:get", () => {
    return Get(localUrl).then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
      expect(res.response).to.be.includes("default");
      expect(typeof res.response).to.be.equal("string");
    });
  });

  test("method:post - json", () => {
    return Post(localUrl + "/json").then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
      expect(res.response).to.be.instanceOf(Object);
      expect(res.response.total).to.be.equal(100);
      expect(res.timeout).to.be.null;
    });
  });

  test("method:post - /json-payload", () => {
    return Post(localUrl + "/json-payload", { body: { name: "tom" }, headers: { "Content-Type": "application/json" } }).then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
      expect(res.response).to.be.instanceOf(Object);
      expect(res.response.total).to.be.equal(100);
      expect(res.timeout).to.be.null;
      expect(res.response.payload).to.be.instanceOf(Object);
      expect(res.response.payload.name).to.be.equal("tom");
    });
  });


  test("method:patch - /json-payload", () => {
    return Patch(localUrl + "/json-payload", { body: { name: "tom" }, headers: { "Content-Type": "application/json" } }).then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
      expect(res.response).to.be.instanceOf(Object);
      expect(res.response.total).to.be.equal(100);
      expect(res.timeout).to.be.null;
      expect(res.response.payload).to.be.instanceOf(Object);
      expect(res.response.payload.name).to.be.equal("tom");
    });
  });

  test("method:put - /json-payload", () => {
    return Put(localUrl + "/json-payload", { body: { name: "tom" }, headers: { "Content-Type": "application/json" } }).then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
      expect(res.response).to.be.instanceOf(Object);
      expect(res.response.total).to.be.equal(100);
      expect(res.timeout).to.be.null;
      expect(res.response.payload).to.be.instanceOf(Object);
      expect(res.response.payload.name).to.be.equal("tom");
    });
  });

  test("method:head - /", () => {
    return Head(localUrl).then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
      expect(res.headers.has("Content-Type")).to.be.true;
    });
  });

  test("method:Delete - /", () => {
    return Delete(localUrl).then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
      expect(res.response).to.be.equal("default");
    });
  });

  test("method:Options - /", () => {
    return Options(localUrl).then(res => {
      expect(res.ok).to.true;
      expect(res.headers).to.be.instanceOf(XsHeaders);
    });
  });

});
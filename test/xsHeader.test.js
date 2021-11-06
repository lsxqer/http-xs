import * as chai from 'chai';

import { createXsHeader, toCamelCase, XsHeaders } from "../src/xsHeader";

const expect = chai.expect;


describe("xsHeader", () => {
  test("xhHeader:new", () => {


    let xsHeader = new XsHeaders({
      "content-type": "application/json"
    });
    expect(xsHeader.get("Content-Type")).to.be.equal("application/json");
    expect(xsHeader.has("content-type")).to.be.ok;

    let xsHeader2 = new XsHeaders([
      ["content-type", "application/json"]
    ]);
    expect(xsHeader.get("Content-Type")).to.be.equal("application/json");
    expect(xsHeader.has("content-type")).to.be.ok;

  });

  test("xhHeader:raw", () => {
    let xsHeader = new XsHeaders({
      "content-type": "application/json"
    });
    expect(xsHeader.raw()).to.deep.equal({ "Content-Type": "application/json" });
  });

  test("xhHeader:toString", () => {
    let xsHeader = new XsHeaders({
      "content-type": "application/json"
    });
    expect(xsHeader.toString()).to.be.equal("[object XsHeaders]")
  });

  test("xhHeader:toJSON", () => {
    let xsHeader = new XsHeaders({
      "content-type": "application/json"
    });
    expect(xsHeader.raw()).to.deep.equal({ "Content-Type": "application/json" });
  });

  test("xhHeader:instance get", () => {
    let xsHeader = new XsHeaders({
      "content-type": "application/json"
    });
    expect(xsHeader.get("content-type")).to.be.equal("application/json");
  });

  test("xhHeader:instance set", () => {
    let xsHeader = new XsHeaders();
    xsHeader.set("content-type", "xs-header-val");
    expect(xsHeader.has("content-Type")).to.be.ok;
    expect(xsHeader.get("Content-Type")).to.be.equal("xs-header-val");
  });

  test("xhHeader:instance has", () => {
    let xsHeader = new XsHeaders();
    xsHeader.set("content-type", "xs-header-val");
    expect(xsHeader.has("content-Type")).to.be.ok;
    expect(xsHeader.has("Content-type")).to.be.ok;
  });

  test("xhHeader:instance delete", () => {
    let xsHeader = new XsHeaders();
    xsHeader.set("content-type", "xs-header-val");
    expect(xsHeader.has("content-Type")).to.be.true;
    xsHeader.delete("Content-type");
    expect(xsHeader.has("content-Type")).to.be.false;
  });

  test("xhHeader:instance forEach", () => {
    let xsHeader = new XsHeaders();
    xsHeader.set("key1", 'val1');
    xsHeader.set("key2", 'val2');
    let key = ``, val = ``;
    xsHeader.forEach((v, k) => {
      key += k;
      val += v;
    })
    expect(key).to.be.equal("Key1Key2");
    expect(val).to.be.equal("val1val2");
  });
});


describe("toCamelCase", () => {
  test("camelcase", () => {
    expect(toCamelCase("a")).to.be.equal("A");
    expect(toCamelCase("a-B")).to.be.equal("A-B");
    expect(toCamelCase("0")).to.be.equal("0");
    expect(toCamelCase("A")).to.be.equal("A");
  });
});

describe("createXsHeader", () => {

  test("xsHeader:object", () => {
    let head = createXsHeader({
      "Content-Type":"application/json"
    });
    expect(head instanceof Headers).to.be.true;
  });

  test("xsHeader:array", () => {
    let head = createXsHeader([
      ["Content-Type"]
    ]);
    expect(head instanceof Headers).to.be.true;
    expect(head instanceof XsHeaders).to.be.false;
  });


  test("xsHeader:force", () => {
    let head = createXsHeader([
      ["Content-Type"]
    ],true);
    expect(head).to.instanceOf(XsHeaders);
  });

  
  test("xsHeader:xsHeader:false", () => {
    let xsHeader = new XsHeaders();

    let head = createXsHeader(xsHeader);
    expect(xsHeader).to.be.equal(head);

  });

  test("xsHeader:xsHeader:true", () => {
    let xsHeader = new XsHeaders();

    let head = createXsHeader(xsHeader,true);
    expect(xsHeader).to.not.equal(head);
  });

  test("xsHeader:xsHeader:Headers", () => {
    let head = createXsHeader();
    expect(head).to.be.instanceOf(Headers);
  });
});
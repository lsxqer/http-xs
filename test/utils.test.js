import * as chai from 'chai';
import {
  isObject,
  isAbsoluteURL,
  isArrayBufferView,
  isEmpty,
  isFormData,
  isNode,
  isStream,
  isUndef,
  getType,
  isArray,
  forEach,
  compose
} from "../src/utils";
import { Stream } from 'stream';

const expect = chai.expect;



describe("utils:获取类型·", () => {
  let object = {};
  let array = [];
  let string = "string";
  let number = 123;
  let date = new Date();
  let arrayBuffer = new ArrayBuffer();
  let u8Array = new Uint8Array();
  let formData = new FormData();
  // let file = new File();
  let bolb = new Blob();
  let urlSearch = new URLSearchParams();
  let buffer = Buffer.from("1123");


  test("Object", () => { expect(getType(object)).to.equal("Object") });
  test("Array", () => { expect(getType(array)).to.equal("Array") });
  test("String", () => { expect(getType(string)).to.equal("String") });
  test("Number", () => { expect(getType(number)).to.equal("Number") });
  test("Date", () => { expect(getType(date)).to.equal("Date") });
  test("ArrayBuffer", () => { expect(getType(arrayBuffer)).to.equal("ArrayBuffer") })
  test("U8array", () => { expect(getType(u8Array)).to.equal("Uint8Array") });
  test("FormData", () => { expect(getType(formData)).to.equal("FormData") });
  test("Blob", () => { expect(getType(bolb)).to.equal("Blob") });
  test("UrlSearchParams", () => { expect(getType(urlSearch)).to.equal("URLSearchParams") });
  test("Buffer", () => { expect(getType(buffer)).to.equal("Uint8Array") });

});

describe("utils:判断类型", () => {
  test("isArray", () => {
    expect(isArray([])).to.be.ok;
  });

  test("isObject", () => {
    expect(isObject({})).to.be.ok;
  });

  test("isFormData", () => {
    expect(isFormData(new FormData())).to.be.ok;
  });


  test("isAbsoluteURL", () => {
    expect(isAbsoluteURL("http://locahost:9090")).to.be.ok;
  });


  test("isArrayBufferView", () => {
    expect(isArrayBufferView(new Uint8Array(new ArrayBuffer(10)))).to.be.ok;
  });


  test("isStream", () => {
    expect(isStream(new Stream.Readable())).to.be.ok;
  })

  test("isNode", () => {
    expect(isNode).to.be.ok;
  });


  test("isUndef", () => {
    expect(isUndef(null)).to.be.ok;
    expect(isUndef(undefined)).to.be.ok;
  });

  test("isEmpty", () => {
    expect(isEmpty(null)).to.be.ok;
    expect(isEmpty(undefined)).to.be.ok;
    expect(isEmpty([])).to.be.ok;
    expect(isEmpty({})).to.be.ok;
    expect(isEmpty("")).to.be.ok;
    expect(isEmpty(new Set())).to.be.ok;
    expect(isEmpty(new Map())).to.be.ok;
    expect(isEmpty(new ArrayBuffer(0))).to.be.ok;
    expect(isEmpty(new ArrayBuffer(10))).to.not.be.ok;
  })
})

describe("utils:compose", () => {
  let fns = [
    v => v + 1,
    v => v + 2,
    v => v + 3
  ];
  test("compose", () => {
    expect(compose(fns, 1)).to.be.equal(7);
  });
});

describe("utils:forEach", () => {
  test("累加数组", () => {
    let count = 0;
    forEach([1, 2, 3, 4, 5], (k, i) => {
      count += k;
    });
    expect(count).to.be.equal(15);
  });

  test("遍历object", () => {
    let obj = {
      k1: '1',
      k2: '2',
      k3: '3'
    }
    let key = ``, val = ``;
    forEach(obj, (k, v) => {
      key += k;
      val += v;
    })

    expect(key).to.be.equal(`k1k2k3`);
    expect(val).to.be.equal(`123`);
  });
  test("null", () => {
    let i = 0;
    forEach(null, (v) => {
      i += v;
    })
    expect(i).to.be.equal(0);
  });
  test("undefined", () => {
    let i = 0;
    forEach(undefined, (v) => {
      i += v;
    })
    expect(i).to.be.equal(0);
  });

  
   
  test("array", () => {
    let i = 0;
    forEach([], (v) => {
      i += v;
    })
    expect(i).to.be.equal(0);
  });
  
  
   
  test("Header", () => {
    let header = new Headers({"content-type":"application/json"});
    let key, val;
    forEach(header, (v,k) => {
      key = k;
      val = v;
    })
    expect(key).to.be.equal("content-type");
    expect(val).to.be.equal("application/json");
  });

});
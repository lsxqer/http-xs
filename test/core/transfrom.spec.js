import { expect } from "chai";
import { urlQuerySerialize, transfromResponse, encode, transfromRequestPayload } from "../../src/core/transform";
import XsHeaders, { contentType } from "../../src/parts/headers";

describe("text:Transfrom", () => {

  test("urlQuerySerialize", () => {
    let url = "http://lcoalhost:4096";
    let query = {
      total: 100,
      type: "concurrent",
      data: [1, 2, 3],
      objects: {
        list: [1, 2, 3]
      }
    };

    expect(urlQuerySerialize(url, query)).to.be.equal(url + "?" + "total=100&type=concurrent&data=1,2,3&objects=" + encode(JSON.stringify(query.objects)))
  });


  test("transfromRequestPayload:search", () => {
    let payload = {
      type: "concurrent",
      pageSize: 10,
      current: 1
    };
    let headers = new XsHeaders();
    headers.append(contentType.contentType, contentType.search);
    let req = {
      body: payload,
      headers: headers
    };

    expect(transfromRequestPayload(req)).to.be.instanceOf(Buffer);
  });


  test("transfromRequestPayload:json", () => {
    let payload = {
      type: "concurrent",
      pageSize: 10,
      current: 1
    };
    let headers = new XsHeaders();

    let req = {
      body: payload,
      headers: headers
    };

    headers.set(contentType.contentType, contentType.json);
    expect(transfromRequestPayload(req).toString()).to.be.equal(Buffer.from(JSON.stringify(payload)).toString());
  });

  test("transfromRequestPayload:formdata", () => {

    let headers = new XsHeaders();
    let formData = new FormData();
    formData.set("page", 1);

    headers.set(contentType.contentType, contentType.json);

    expect(transfromRequestPayload({ headers: headers, body: formData })).to.be.contain(formData);
    expect(headers.has(contentType.contentType)).to.be.false;
  });


  let responseStruct = {
    response: "text",
  };

  test("transfromResponse:u8array", () => {
    expect(transfromResponse(responseStruct,"u8array").response).to.be.instanceOf(Uint8Array);
  });

  test("transfromResponse:text", () => {
    responseStruct.response = "text";
    expect(transfromResponse(responseStruct,"text").response).to.be.equal("text");
  });

  test("transfromResponse:json", () => {
    responseStruct.response = JSON.stringify({total:10});
    expect(transfromResponse(responseStruct,"json").response).to.deep.equal({total:10});
  });
  
});
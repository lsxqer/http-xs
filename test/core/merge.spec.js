import { expect } from "chai";
import mergeConfig from "../../src/core/merge";


describe("test:mergeConfig", () => {

  test("merge url to opts", () => {
    let url = "http:test";
    let nextConfig = mergeConfig(url);

    expect(nextConfig.url).to.be.equal(url);
  });

  test("merge firstObject to opts", () => {
    let url = "http:test";
    let nextConfig = mergeConfig({ url });

    expect(nextConfig.url).to.be.equal(url);
  });

  test("merge args to opts", () => {
    let url = "http:test";
    let nextConfig = mergeConfig({ url }, { timeout: 1000 });

    expect(nextConfig.url).to.be.equal(url);
    expect(nextConfig.timeout).to.be.equal(1000);
  });


});
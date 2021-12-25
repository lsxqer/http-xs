import * as chai from 'chai';
import { Get, Post, Delete, Put, Patch, Options, Head } from "../src/httpMethod";
import XsCancel from '../src/xsCancel';

const expect = chai.expect;


describe("method:Function", () => {
  test("Get", () => {
    expect(typeof Get).to.be.equal("function");
  });

  test("Post", () => {
    expect(typeof Post).to.be.equal("function");
  });

  test("Delete", () => {
    expect(typeof Delete).to.be.equal("function");
  });

  test("Put", () => {
    expect(typeof Put).to.be.equal("function");
  });

  test("Patch", () => {
    expect(typeof Patch).to.be.equal("function");
  });

  test("Options", () => {
    expect(typeof Options).to.be.equal("function");
  });

  test("Head", () => {
    expect(typeof Head).to.be.equal("function");
  });
});

const localUrl = `http://localhost:8090`;


describe("method:Promise", () => {
  test("Get", () => {
    return Get(localUrl).then(r => {
      expect(r.ok).to.be.true;
    });
  });

  test("Post", () => {
    return Post(localUrl).then(r => {
      expect(r.ok).to.be.true;
    });
  });

  test("Delete", () => {
    return Delete(localUrl).then(r => {
      expect(r.ok).to.be.true;
    });
  });

  test("Put", () => {
    return Put(localUrl).then(r => {
      expect(r.ok).to.be.true;
    });
  });

  test("Patch", () => {
    return Patch(localUrl).then(r => {
      expect(r.ok).to.be.true;
    });
  });

  test("Options", () => {
    return Options(localUrl).then(r => {
      expect(r.ok).to.be.true;
    });
  });
  test("Head", () => {
    return Head(localUrl).then(r => {
      expect(r.ok).to.be.true;
    });
  });
});


describe("method:Response", () => {
  test("Get", () => {
    return Get(localUrl).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("get");
    });
  });

  test("Post", () => {
    return Post(localUrl).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("post");
    });
  });

  test("Delete", () => {
    return Delete(localUrl).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("delete");
    });
  });

  test("Put", () => {
    return Put(localUrl).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("put");
    });
  });

  test("Patch", () => {
    return Patch(localUrl).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("patch");
    });
  });

  test("Options", () => {
    return Options(localUrl).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("options");
    });
  });

  test("Head", () => {
    return Head(localUrl).then(res => {
      expect(res.ok).to.be.true;
      expect(res.message).to.be.equal("OK");
      expect(res.status).to.be.equal(200);
      expect(res.type).to.be.equal("default");
      expect(res.enhanceConfig.method).to.be.equal("head");
    });
  });
});

const timeoutUrl = localUrl + "/timeout";

// timeout
describe("Timeout", () => {
  test("get timeout", () => {
    return Get(timeoutUrl, {
      timeout: 1000,
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Network Timeout");
      expect(res.type).to.be.equal("timeout");
      expect(res.enhanceConfig.timeout).to.be.equal(1000);
    });
  });

  test("post timeout", () => {
    return Post(timeoutUrl, {
      timeout: 1000,
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Network Timeout");
      expect(res.type).to.be.equal("timeout");
      expect(res.enhanceConfig.timeout).to.be.equal(1000);
    });
  });

  test("put timeout", () => {
    return Put(timeoutUrl, {
      timeout: 1000,
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Network Timeout");
      expect(res.type).to.be.equal("timeout");
      expect(res.enhanceConfig.timeout).to.be.equal(1000);
    });
  });

  test("delete timeout", () => {
    return Delete(timeoutUrl, {
      timeout: 1000,
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Network Timeout");
      expect(res.type).to.be.equal("timeout");
      expect(res.enhanceConfig.timeout).to.be.equal(1000);
    });
  });

  test("head timeout", () => {
    return Head(timeoutUrl, {
      timeout: 1000,
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Network Timeout");
      expect(res.type).to.be.equal("timeout");
      expect(res.enhanceConfig.timeout).to.be.equal(1000);
    });
  });


  test("patch timeout", () => {
    return Patch(timeoutUrl, {
      timeout: 1000,
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Network Timeout");
      expect(res.type).to.be.equal("timeout");
      expect(res.enhanceConfig.timeout).to.be.equal(1000);
    });
  });

  test("options timeout", () => {
    return Options(timeoutUrl, {
      timeout: 1000,
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Network Timeout");
      expect(res.type).to.be.equal("timeout");
      expect(res.enhanceConfig.timeout).to.be.equal(1000);
    });
  });
});

const cancelUrl = 'http://localhost:8090';

describe("cancel", () => {
  test("get cancel", () => {
    let xsCancel = new XsCancel();
    let promise = Get(cancelUrl, {
      cancel: xsCancel
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Client Aborted");
      expect(res.type).to.be.equal("aborted");
    });
    xsCancel.abort();
    return promise;
  });

  test("post cancel", () => {
    let xsCancel = new XsCancel();
    let promise = Post(cancelUrl, {
      cancel: xsCancel
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Client Aborted");
      expect(res.type).to.be.equal("aborted");
    });
    xsCancel.abort();
    return promise;
  });

  test("put cancel", () => {
    let xsCancel = new XsCancel();
    let promise = Put(cancelUrl, {
      cancel: xsCancel
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Client Aborted");
      expect(res.type).to.be.equal("aborted");
    });
    xsCancel.abort();
    return promise;
  });

  test("delete cancel", () => {
    let xsCancel = new XsCancel();
    let promise = Delete(cancelUrl, {
      cancel: xsCancel
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Client Aborted");
      expect(res.type).to.be.equal("aborted");
    });
    xsCancel.abort();
    return promise;
  });

  test("head cancel", () => {
    let xsCancel = new XsCancel();
    let promise = Head(cancelUrl, {
      cancel: xsCancel
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Client Aborted");
      expect(res.type).to.be.equal("aborted");
    });
    xsCancel.abort();
    return promise;
  });


  test("patch cancel", () => {
    let xsCancel = new XsCancel();
    let promise = Patch(cancelUrl, {
      cancel: xsCancel
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Client Aborted");
      expect(res.type).to.be.equal("aborted");
    });
    xsCancel.abort();
    return promise;
  });

  test("options cancel", () => {
    let xsCancel = new XsCancel();
    let promise = Options(cancelUrl, {
      cancel: xsCancel
    }).catch(res => {
      expect(res.response).to.be.null;
      expect(res.status).to.be.equal(0);
      expect(res.ok).to.be.false;
      expect(res.message).to.be.equal("Http-xs: Client Aborted");
      expect(res.type).to.be.equal("aborted");
    });
    xsCancel.abort();
    return promise;
  });
});

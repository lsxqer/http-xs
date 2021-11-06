// import http from "http";
const http = require("http");
const fs = require("fs");



function json(res, jsonSource) {
  res.end(JSON.stringify(jsonSource));
}

const port = 8090;
http.createServer((req, res) => {
  let url = req.url;

  console.log("来了", req.url, req.method, `header : content-type = ${req.headers["content-type"]}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS,DELETE,  PUT, GET");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  let chks = [];


  if (url === "/download-image") {
    fs.createReadStream("./react.png").pipe(res);
    return;
  }

  
  if (url === "/timeout") {
    console.log("00000");
    setTimeout(() => {
      json(res, { code: 200, success: true, message: "timeout out" });
    }, 2000)
    return;
  }


  if (req.method === "GET") {
    json(res, { success: true, code: 200, data: req.url, header: req.headers["content-type"] });
    return;
  }

  req.on("data", ch => {
    chks.push(ch);
  });

  req.on("end", () => {

    if (url === "/upload-file") {
      let ws = fs.createWriteStream("./download/1.png");
      req.pipe(ws);
      json(res, { ok: true, code: 200, message: "ok" });
      return;
    }


    let buf = Buffer.concat(chks).toString("utf8");

    if (url === "/post-json") {
      res.setHeader("Content-Type", "application/json");
      json(res, { reqData: buf ? JSON.parse(buf) : {}, code: 200, ok: true, data: [1, 22, 4] });
      return;
    }

    if (url === "/post-default") {
      json(res, { reqData: buf, code: 200, ok: true, message: "ok" });
      return;
    }

    json(res, { success: true, code: 200, data: buf });
  });

}).listen(port, () => {
  console.log(port);
});


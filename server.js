const http = require("http");



http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Headers","")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE, PUT,OPTIONS")

  res.end(JSON.stringify({NAME:"SFDASFASDF"}));


}).listen(4096,() => {
  console.log("server runing, port on 4096");
})
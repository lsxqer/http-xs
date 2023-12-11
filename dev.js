

const { create } = require("./out/iife/index");
// // import {Get} from "./out/esm/index.js";



const inst = create();

inst.use(async (ctx, next) => {

  console.log(ctx.url);
  try {
    const a = await next();
    console.log("xxxx, usess", a.status);
    // throw new Error("err 错误"

    throw (a)
  } catch (e) {
    console.log('00');
    return Promise.reject (e)
  }
})
inst.get("http://127.0.0.1:4096/err")
  .then(rs => {


    console.log(rs, "dev");
  })
  .catch(err => {
    console.log("最后错误", err);
  });
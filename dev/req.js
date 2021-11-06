
// const x = require("../lib/umd/index");
// import { Get } from "../lib/umd/index.js";

const xs = require("../lib/umd/index");
const http = require("http");
const fs = require("fs");
const { Get, Post, get, createXsHeader } = xs;

let localUrl = "http://localhost:8090";


const urlSearch = new URLSearchParams();
urlSearch.set("name", "111");
urlSearch.set("age", "101");
urlSearch.set("bodyType", "urlsearchparams");


const jsonData = JSON.stringify({
  data: "jsonstring",
  dataType: "json",
  payload: [1, 3, 4, 5, 6]
})


const inst = new xs.HttpXs({ baseURL: localUrl });

inst.post({
  url: "/json",
  // responseType: "text",
  body:{
    name:"xxx"
  }
})
  .then(r => {
    console.log(r);
  })
  .catch(err => {
    console.log(err);
  })
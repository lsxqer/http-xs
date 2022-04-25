
import * as Xs from "./src";



const {create,HttpXsDefaultProto,Get,contentType, XsHeaders} = Xs;


const instce = create({
  baseUrl:"http://localhost:4096"
});


// instce.get("/json")
// .then(r =>{
//   console.log(r);
// });

let m  = new Map<string,() => Promise<any>>();

m.set("key1", () => instce.get("/json"));
m.set("key2", () => instce.get("/json"));
m.set("key3", () => instce.get("/json"));
m.set("key43", () => instce.get("/json"));
m.set("key14", () => instce.get("/json"));



// instce.asyncIterable(m).then(r => {
//   console.log(m.get("key1"));
// })

// Get("http://localhost:4096/json").then(r => {
//   console.log(r);
// });

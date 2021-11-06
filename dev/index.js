
import { xs, useBefore } from "../src"




const githubApi = "https://api.github.com/users";
const localUrl = "http://localhost:8090";


const urlSearch = new URLSearchParams();
urlSearch.set("name", "111");
urlSearch.set("age", "101");
urlSearch.set("bodyType", "urlsearchparams");

const jsonData = JSON.stringify({
  data: "jsonstring",
  dataType: "json",
  payload: [1, 3, 4, 5, 6]
})





globalThis.xs = xs;
globalThis.localUrl = localUrl;
document.getElementById("download").addEventListener("click", () => {

  let file = document.querySelector("#file").files[0];


  let formData = new FormData();

  formData.set("file", file);

  // xs.post(localUrl, {
  //   body:formData,
  //   progress:evl => {
  //     console.log(evl);
  //   },
  //   uploadProgress:null
  // }).then(r => {
  //   console.log(r);
  // })

  // xs.get(localUrl, {
  //   progress: evl => {
  //     console.log(evl);
  //   },
  //   uploadProgress: evl => {
  //     console.log(evl);
  //   }
  // })
  //   .then(r => {
  //     console.log(r);
  //   })

})



// 文件下载
/*  
 xs.get(localUrl + "/download-image", { responseType: "blob" }).then(res => {
    // 如果没有resonsetType 是string 如果使用u8arr 转换可否下载?
 
    let blob = new Blob([res.response], { type: "image/png" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.download = 'react.png';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }) 
  
*/


const arraybuffer = new ArrayBuffer(3);

let view = new Uint8Array(arraybuffer);
view[0] = 99;
view[1] = 97;
view[2] = 98;
// xs.post(localUrl, {
//   body: view,
// }).then(response)


function response(res) {
  console.log(JSON.stringify(res, null, 4));
  console.log(`responseType:->{ ${res.enhanceConfig.responseType} }<-`);
  console.log(`type:->{ ${res.enhanceConfig.type} }<-`);


}


let httpXs = new xs.HttpXs({
  baseURL: localUrl,
  // timeout: 2000,
  transformationRequest: [
    config => {
      // console.log("httpxs base config");
      return config;
    }
  ]
});



httpXs.useBefore([
  config => {
    // console.log("httpxs useBefore");
    return config;
  },
  // useBefore((config) => {
  //   config.naneee = 10000
  //   return false
  // })
])





const api = xs.defineInterface(httpXs, {
  getJson: {
    method: "post",
    url: "/get-json",
  }
});


api.getJson({
  transformationRequest: [
    config => {
      // console.log("api before");
      return config
    },
    config => {

      return config;
    }
  ],
  type:"fetch",
  responseType:"text",
  headers:{
    "Content-Type":"application/json"
  }
})
  .then(response).catch(err => {
    console.log(err);
  })
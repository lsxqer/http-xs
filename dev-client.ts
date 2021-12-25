import { HttpXs, XsCancel } from "./src";
import axios from "axios";


const xsClient = new HttpXs();


const url = "http://localhost:4096";

// xsClient.get<string>(url + "?name=abc")
// .then(r => {
//   console.log(r);
// });


xsClient.use(
  async (req, next) => {

    let r = await next();

    console.log(r);
    return r;
  }
)


// axios.post(url+ "?name=abc",{timeout:1000}).then(r => {
//   console.log(r);
// });

const cancel = new XsCancel();


xsClient.post(url, { body: JSON.stringify({ name: "大粑粑" }), requestMode:"xhr"})
  .then(r => {
    console.log(typeof r);
  });

cancel.abort();
cancel.abort();

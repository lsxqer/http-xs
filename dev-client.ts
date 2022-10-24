import { Get, XsCancel } from "./src";

let cancel: InstanceType<typeof XsCancel> = null!;

document.querySelector(".click")?.addEventListener("click", () => {

  if (cancel !== null) {
    cancel.abort();
    cancel = null!;
  }

  cancel = new XsCancel();

  Get("http://localhost:4096/timeout", { cancel: cancel })
    .then(rs => {
      console.log(rs);
    }).catch(exx => {
      
      console.log(exx.toString());
      console.log(exx.stringify());
      console.log(exx.toJson());
    });
});
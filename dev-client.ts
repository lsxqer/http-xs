

let url = "/query/{id}/{is}";

let matchRe = /{[\w]+}/g;

let r;

let t = [1, 3];

let nextUrl = url.slice(0, url.indexOf("{") - 1);
let i = 0;
while ((r = matchRe.exec(url), r !== null) && i < 1000) {
  i++;
  nextUrl += "/" + t.shift();

}


console.log(nextUrl);

import 'dart:convert';
import 'dart:io';

main() async {
  HttpServer server = await HttpServer.bind("127.0.0.1", 4096);

  print("server runing~~, port is 4096");
  await for (HttpRequest req in server) {
    HttpResponse res = req.response;

  res.headers.remove("Transfer-Encoding", "close");

    res.headers
      ..set("Access-Control-Allow-Origin", "*")
      ..set("Access-Control-Allow-Methods", "GET,POST,DELETE, PUT,OPTIONS");

    String method = req.method;
    String path = req.uri.path;

    print("${method}-> ${req.uri.path} --> ${req.uri.query}");

    switch (path) {
      case "/timeout":
        sleep(Duration(milliseconds: 2000));
        res.write("timeout");
        res.close();
        break;
      case "/json":
        res.write(jsonEncode(<String, dynamic>{
          "data": [1, 2, 3, 4],
          "ok": true,
          "total": 100
        }));
        res.close();
        break;
      case "/err":
        res.statusCode = 400;
        // res.write("1123error");
        // res.headers.contentType =ContentType.json;
          res.write(jsonEncode(<String, dynamic>{
          "data": [1, 2, 3, 4],
          "ok": true,
          "total": 100
        }));
        res.close();
        break;
      case "/json-payload":
        req.listen((data) {
          res.write(jsonEncode(<String, dynamic>{
            "data": [1, 2, 3, 4],
            "ok": true,
            "total": 100,
            "payload": json.decode(utf8.decode(data))
          }));
          res.close();
        });
        break;
      case "/text":
        res
          ..write("text")
          ..close();
        break;
      default:
        res
          ..write("default")
          ..close();
    }
  }
}

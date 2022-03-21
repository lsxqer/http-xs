import 'dart:convert';
import 'dart:io';

main() async {
  HttpServer server = await HttpServer.bind("localhost", 4096);

  print("server runing~~, port is 4096");
  await for (HttpRequest req in server) {
    HttpResponse res = req.response;

    res.headers
      ..set("Access-Control-Allow-Origin", "*")
      ..set("Access-Control-Allow-Methods", "GET,POST,DELETE, PUT,OPTIONS");

    String method = req.method;
    print("${method}-> ${req.uri.path} --> ${req.uri.query}");

    if (["POST"].contains(method)) {
      req.listen((data) {
        print(utf8.decode(data));
        // Duration()
        sleep(Duration(milliseconds: 2000));
        res.write(utf8.decode(data));
        res.close();
      });
    } else {
      res.write("get");
      res.close();
    }
  }
}

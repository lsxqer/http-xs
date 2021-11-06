import 'dart:convert';
import 'dart:io';

main(List<String> args) async {
  print("7079");

  HttpServer.bind("localhost", 7079).then((server) {
    server.listen((HttpRequest req) async {
      HttpResponse res = req.response;
      res.headers.add('Access-Control-Allow-Origin', '*');
      res.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.headers.add('Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept');
      res.headers.contentType = ContentType.json;
      res
        ..write(json.encode({"server": "dart", "ok": true, "code": 200}))
        ..close();
    });
  });
}

var http  = require("http");
var url   = require("url");
var exec  = require('child_process').exec;

function onRequest(request, response)
{
  exec('atom /Users/kodi/Desktop/knix' + url.parse(request.url).path);
  response.write("<!DOCTYPE html><html><head><title>knixx</title></head><body></body></html>");
  response.end()
  exec('osascript /Users/kodi/Desktop/knix/close.applescript');
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");

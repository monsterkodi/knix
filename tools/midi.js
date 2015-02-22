var midi   = require('midi');
var WebSocketServer = require('websocket').server;
var http   = require("http");
var url    = require("url");
var moment = require('moment');

var input = new midi.input();
 
var ports = input.getPortCount();
 
var connection;

for (var p = 0; p < ports; p++)
{
  var portName = input.getPortName(p);
  console.log("port" + String(p) + ": " + portName);
}
  
input.on('message', function(deltaTime, message) 
{
  console.log('m:' + message + ' d:' + deltaTime);
  connection.send(message);
});

input.openPort(0);

input.ignoreTypes(true, true, false);
 
function onRequest(request, response)
{
  console.log(":: " + process.cwd() + url.parse(request.url).path);
  
  response.write("\
    <!DOCTYPE html>\
    <html lang='en'>\
      <head>\
        <meta charset='utf-8'>\
        <title>midi test</title>\
        <script> \
        var sock = new WebSocket('ws://localhost:7777/', 'midi-test'); \
         sock.onopen = function(e) { \
             console.log('open'); \
             sock.send('hello');\
         }; \
         sock.onmessage = function(e) { \
             console.log('got', e.data); \
         }; \
         sock.onclose = function() { \
             console.log('close'); \
         }; \
         say = function(s) {console.log(\"send \"+s); sock.send(s); } \
        </script>\
    </head>\
      <body>\
      hello!\
      <a onclick='say(\"bla\");'>say</a>\
      </body>\
    </html>"
  );
  
  response.end();
}

var port = 7777;
server = http.createServer(onRequest).listen(port);
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {

    connection = request.accept('midi-test', request.origin);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

console.log(":: port "+String(port)+" :: "+moment().format('h:mm:ss'));

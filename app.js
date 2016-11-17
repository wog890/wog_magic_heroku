var WebsocketServer = require('ws').Server;
var express = require('express');
var http = require('http');

var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wsServer = new WebsocketServer({server: server});
console.log("websocket server created");

wsServer.on('connection', function(ws) {
	var id = setInterval(function() {
		ws.send(JSON.stringify(new Date()), function(){});
	}, 1000);
	console.log("websocket connection open");
	ws.on('close', function() {
		console.log('websocket connection close');
		clearInterval(id);
	});
});
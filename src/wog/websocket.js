module.exports = function() {

	// Private ---------------------------------------------------------------------------------------------

	var _public = {};
	var WebSocketServer = require('websocket').server;

	var http = require('http');
	var server = http.createServer(function(request, response) {});
	var wsServer = new WebSocketServer({httpServer: server});
	var count = 0;
	var clients = {};

	function connectionClosed(reasonCode, description, connection, id) {
		delete clients[id];
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected');
	}

	function recieveConnectionRequest(r) {
		var connection = r.accept('echo-protocol', r.origin);
		var id = count++;
		clients[id] = connection;
		console.log((new Date()) + ' Connection accepted [' + id + ']');
		connection.on('close', function(reasonCode, description) {
			connectionClosed(reasonCode, description, connection, id);
		});
		connection.on('message', function(message) {
			recieveMessage(message, connection, id);
		});
	}

	function recieveMessage(event, connection, id) {
		var message = JSON.parse(event.data);
		console.log(message.reason);
	}

	// Public ----------------------------------------------------------------------------------------------

	_public.init = function() {
		server.listen(8080, function() {
			console.log((new Date()) + ' Server is listening on port 8080');
		});
		wsServer.on('request', recieveConnectionRequest);
	};

	return _public;

}();
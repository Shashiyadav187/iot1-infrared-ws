var socketServer = require("nodejs-websocket");
var hue = require('./routes/hue');
console.log('foo!');

var wsServer = socketServer.createServer(function (conn) {
	console.log("New Connection");
	conn.on("text", function (str) {
		
		var data = JSON.parse(str);

		switch (data.cmd) {
			case 'listbulbs' :
				hue.getFullState(function(result) {
					var data = {cmd: 'listbulbs', data: result};
					broadcast(JSON.stringify(data));					
				});
			break;
			case 'setStatus' :
				hue.setBulbStatus(data.lightId,data.status, function(status) {
				    if (status.success) {
					   var res = {
					   	 cmd: 'setStatus',
						 status: data.status   	   
					   };
					   broadcast(JSON.stringify(data));
					}
				});
				break;
		}
		console.log("Received "+str)
		// conn.sendText(str.toUpperCase()+"!!!")
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	})
}).listen(3001);

function broadcast(msg) {
	wsServer.connections.forEach(function (conn) {
		conn.sendText(msg)
	})
}

module.exports = {"broadcast" : broadcast};


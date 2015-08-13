var ExpressPeerServer = require("peer").ExpressPeerServer;

module.exports = function (server, options) {
	var peerServer = ExpressPeerServer(server, options);

	peerServer.on("connection", function () {
		
	});

	peerServer.on("disconnect", function () {
		
	});
	return peerServer;
}
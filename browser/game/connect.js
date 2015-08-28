var Board = require("./game.components/board"),
	Interface = require("./game.logic/initialization/interface"),
	gameSettings = require("../settings"),
	clearBoard = require("./game.logic/clearBoard"),
	loading = require("./loading"),
	httpGet = require("../lib/httpUtil");
	require("../lib/noBack");

//Utility object to hold the client's Id, peer reference, and current connection reference
var game = {myId: undefined, player: undefined, opponent: undefined, board: undefined};
var gameInterface;

function PeerConnect (playerData) {
	playerData = playerData || {playerColor: gameSettings.player, opponentColor: gameSettings.opponent};
	httpGet("/env", connectToServer);

	//When a peer DataConnection is established
	function peerDataCommunication(peerconn) {
		game.opponent = peerconn;

		//When the connection opens...
		peerconn.on("open", function () {
			loading.off();
			if(game.role === "host") {
				console.log(game.board);
				peerconn.send({type: "board", board: game.board});
				gameInterface = new Interface(game, playerData);
			}
			//Listen for data
			peerconn.on('data', function (data) {
				//Do stuff with incoming data
				if(data.type === "board"){
					game.board = data.board;
					gameInterface = new Interface(game, playerData);
					peerconn.send({type: "move", moves: []});
				}else if (data.type === "move"){
					gameInterface.updateBoard(data);
				}
			});
		});

		//If the other user closes the connection, search for another user
		peerconn.on("close", function () {
			console.log("closing connection");
			peerconn.close();
			game.opponent = undefined;
			game.board = undefined;
			gameInterface = undefined;
			clearBoard();
			loading.on();
			httpGet("/meet/" + game.myId, meetSomeone);
			$('.mgNavigator').remove();
		});

		//If the user closes the tab, tell the other user
		window.onbeforeunload = function () {
			clearBoard();
			$('.mgNavigator').remove();
			peerconn.close();
		};
	}

	//Receive the response from the server, potentially with another user's peer id
	function meetSomeone(res) {
		if (res.meet === "hold") {
			game.role = "host";
			game.opponentRole = "client";
			game.board = Board.generate();
			console.log("Waiting for a new friend");
		} else {
			game.role = "client";
			game.opponentRole = "host";
			console.log("Meet ", res.meet);
			peerDataCommunication(game.player.connect(res.meet));
		}
	}

	//Establish peer connection with server
	function connectToServer(res) {
		if (res.env === "production") {
			game.player = new Peer({
				host: "/",
				port: 80,
				wsport: 8000,
				path: "/api",
				config: {
					"iceServers": [{url: "stun:stun.l.google.com:19302"}]
				}
			});
		} else {
			game.player = new Peer({host: "127.0.0.1", port: 3000, path: "/api", debug: 2});
		}
		//When the peer connection is established
		game.player.on("open", function (id) {
			game.myId = id;
			//Try to meet someone
			loading.on();
			httpGet("/meet/" + id, meetSomeone);
		});
		//If someone calls, you answer
		game.player.on("connection", function (peerconn) {
			peerDataCommunication(peerconn);
		});
		//If there is an error you get back in line
		game.player.on("error", function () {
			clearBoard();
			loading.on();
			httpGet("/meet/" + game.myId, meetSomeone);
		});
	}
}

module.exports = PeerConnect;


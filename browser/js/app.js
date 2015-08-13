define(["lib/peer", "js/board"], function (Peer, Board) {



	//Is there a connection?
	var liveConn = false;
	var board;
	//Utility object to hold the client's Id, peer reference, and current connection reference
	var identity = {myId: undefined, peer: undefined, conn: undefined};

	//Utility method for sending http Ajax get requests
	function httpGet(url, cb) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				cb(JSON.parse(this.response));
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	//When a peer DataConnection is established
	function peerDataCommunication(peerconn) {
		identity.conn = peerconn;

		//When the connection opens...
		peerconn.on("open", function () {
			liveConn = true;
			//Listen for data
			peerconn.on('data', function (data) {
				//Do stuff with incoming data
				console.log(data);
			});
		});

		//vvvvvvv how to send data (peerconn.send({}) or identity.conn.send({}), same reference) vvvv
		// if (liveConn) {
  //           identity.conn.send({
  //         		something: [0,1,2,3],
  //               somethingElse: {data: 2, number: 4}
  //           });
  //       }


		//If the other user closes the connection, search for another user
		peerconn.on("close", function () {
			console.log("closing connection");
			peerconn.close();
			identity.conn = undefined;
			liveConn = false;
			httpGet("/meet/" + identity.myId, meetSomeone);
		});

		//If the user closes the tab, tell the other user
		window.onbeforeunload = function () {
			peerconn.close();
		};
	}

	//Receive the response from the server, potentially with another user's peer id
	function meetSomeone(res) {
		if (res.meet === "hold") {
			identity.role = "host";
			board = Board.generate();
			var s = new sigma({
				graph: board,
				renderers: [
					{
						container: document.getElementById("container"),
						type: "canvas"
					}
				]
			});

			// var hey = function (event) { revealLinks(event.data.node) };
			// s.bind("clickNode", hey);
			console.log("Waiting for a new friend");
		} else {
			identity.role = "client";
			console.log("Meet ", res.meet);
			peerDataCommunication(identity.peer.connect(res.meet));
		}
	}

	//Establish peer connection with server
	function connectToServer(res) {
		if (res.env === "production") {
			identity.peer = new Peer({
				host: "/",
				port: 80,
				path: "/api",
				config: {
					"iceServers": [{url: "stun:stun.l.google.com:19302"}]
				}
			});
		} else {
			identity.peer = new Peer({host: "127.0.0.1", port: 3000, path: "/api", debug: 2});
		}
		//When the peer connection is established
		identity.peer.on("open", function (id) {
			console.log("my id: ", id);
			identity.myId = id;
			//Try to meet someone
			httpGet("/meet/" + id, meetSomeone);
		});
		//If someone calls, you answer
		identity.peer.on("connection", function (peerconn) {
			peerDataCommunication(peerconn);
		});
	}

	httpGet("/env", connectToServer);
	// return App;
});

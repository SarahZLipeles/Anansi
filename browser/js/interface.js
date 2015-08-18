define(["js/Thread/Thread"], function (Thread) {
	
	"use strict";

	var view;

	function updateLinks(node, color, claimer, sourceNode){
		color = color || "#000000";
		if(node.id !== view.graph.bases[this.role].id){
			if(!node.from && sourceNode){
				// console.log(node.from, sourceNode, node.color, this.playerColor)
				node.from = sourceNode.id;
				sourceNode.to.push(node.id);
				// console.log(node.from)
			}else if(node.from && sourceNode && node.color !== sourceNode.color){
				console.log(node.to)
				var oldNode = view.graph.nodes(node.from)
				oldNode.to.splice(oldNode.to.indexOf(node.id), 1)
				node.from = sourceNode.id;
				sourceNode.to.push(node.id);

				var makeBlack = function(nodeId){
					var node = view.graph.nodes(nodeId)
					console.log(nodeId)
					node.color = "#000000"
					node.to.forEach(function(id){
						makeBlack(id)
					})
					node.to.length = 0
					node.from = undefined
				}
				for(var i = 0; i < node.to.length; i++){
					makeBlack(node.to[i])
				}
				// node.to.forEach(makeBlack)
			}
		}
		node.color = color;
		view.refresh({skipIndexation: true});
		return node;
	}


		// var nodelinks = view.graph.nodes(node.links);
// <<<<<<< HEAD
		// var nodeedges = view.graph.edges(node.edges);

// 		if(claimer){
// 			for(var i = 0; i < nodelinks.length; i++){
// 				nodelinks[i].hidden = false;
// 				// nodeedges[i].hidden = false;
// // =======
// // 		for(var i = 0; i < nodelinks.length; i++){
// // 			if(claiming){
// // 				nodelinks[i].hidden = false;
// // 			}
// // 			if(nodelinks[i].color === color){
// // 				// node.from.push(nodelinks[i].id)
// // 				// nodelinks[i].to.push(node.id)
// // 			}else if(nodelinks[i].color !== "#000000"){
// // 				var isSource = nodelinks[i].from === node.id;
// // 				if(isSource){
// // 					updateLinks(nodelinks[i], color, true);
// // 				}
// // >>>>>>> 8d740a5f41c7c0fdde90a2f89d71c823ba9fb535
// 			}
// 			// if(nodelinks[i].color !== "#000000"){
// 			// 	var isSource = nodelinks[i].from === node.id;
// 			// 	if(isSource){
// 			// 		updateLinks(nodelinks[i], color, true);
// 			// 	}
// 			// }
// 		}
		// else{

		// }


	// window.addEventListener("keyup", function(e) {
	// 	var keyCode = e.keyCode;
	// 	if (keyCode === 109) {
			
	// 	}
	// });
	
	function Interface (game) {
		this.role = game.role;
		var color = game.board[this.role];
		this.playerColor = color;
		this.opponent = game.opponent;
		console.log(game.board);
		view = new sigma({
					graph: game.board,
					renderers: [{
						container: document.getElementById("container"),
						type: "gameSvg",
						settings: {
							enableHovering: true
						}
					}],
					settings: {
						drawLabels: false,
						player: color,
						width: game.board.width,
						height: game.board.height
					}
				});
		console.log(view);
		view.graph.bases = game.board.bases;
		view.graph.color = color;
		this.thread = new Thread(2, view.graph, this.claim.bind(this), this.role);
		var clickANode = function (func, event) {
			var node = event.data.node
			var links = node.links
			for(var i=0; i < links.length; i++){
				if(view.graph.nodes(links[i]).color === this.playerColor){
					return func(node, view.graph.nodes(links[i]));
				}
			}
		};

		// var clickANode = function(event){
		// 	var claimedLinks = []
		// 	var availableLinks = [];
		// 	this.thread.crawl(event.data.node.id, {
		// 		start: function(id){
		// 			this.attackNode(view.graph.bases[game.role].id, id)
		// 		},
		// 		receiveLinks: function(id, links){
		// 			// var self = this
		// 			// claimedLinks.push(id)
		// 			// links.forEach(function(link){
		// 			// 	if(claimedLinks.indexOf(link) === -1)
		// 			// 		self.attackNode(id, link)
		// 			// });
		// 			if (availableLinks.length !== 0) {
		// 				links.forEach(function(link) {
		// 					availableLinks.push({source: id, link: link})
		// 				})
		// 				var link = availableLinks.pop();
		// 				this.attackNode(link.source, link.link);

		// 			} else {
		// 				this.attackNode(id, links[0])
		// 				links.slice(1).forEach(function(link) {
		// 					availableLinks.push({source: id, link: link})
		// 				})
		// 			}
		// 			// for(var i=(links.length - 1); i >= 0; i--){
		// 			// 	if(claimedLinks.indexOf(links[i]) === -1){
		// 			// 		self.attackNode(id, links[i])
		// 			// 		break;
		// 			// 	}
		// 			// }
		// 		}
		// 	})

		// }

		// var clickANode = function(event){
		// 	this.thread.moveBase(event.data.node.id);
		// 	view.refresh();
		// };

		var hey = function (func, event) { 
			var crawl = function(node) {
				var crawled = [];
				var queue = [];
				var crawlLayer = function(claimedNode) {
					queue = claimedNode.links.concat(queue);
				};
				crawlLayer(func(node));
				var timeout = setInterval(function() {
					if (queue.length === 0) window.clearInterval(timeout);
					var n = queue.shift();
					if (crawled.indexOf(n) === -1) {
						crawlLayer(func(view.graph.nodes(n)));
						crawled.push(n);
					}
				}, 2);
			};
			crawl(event.data.node);
		};

		hey = hey.bind(this, this.claim.bind(this));
		clickANode = clickANode.bind(this, this.claim.bind(this));
		// clickANode = clickANode.bind(this);

		view.bind("clickNode", clickANode);

		var baseId = this.role === "host" ? game.board.bases.host.id : game.board.bases.client.id;
		var base = view.graph.nodes(baseId);
			base.hidden = false;
			updateLinks.call(this, base, color, true);
	}

	Interface.prototype.addOpponent = function (opponent) {
		this.opponent = opponent;
	};


	Interface.prototype.claim = function (node, sourceNode) {
		var returnedNode = updateLinks.call(this, node, this.playerColor, true, sourceNode);
		this.opponent.send({type: "claim", data: node.id, color: this.playerColor, source: sourceNode.id});
		return returnedNode;
	};

	Interface.prototype.updateBoard = function (nodeid, color, sourceId) {
		var node = view.graph.nodes(nodeid);
		var source = view.graph.nodes(sourceId)
		updateLinks.call(this, node, color, false, source);
	};


	return Interface;
});

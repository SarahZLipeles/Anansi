define(["js/game.components/Thread", "js/game.logic/renderloop.js"], function (Thread, RenderLoop) {
	
	"use strict";

	var view, queue, nodes;

	function updateLinks(nodeid, color, sourceNodeid){
		var node = queue(nodeid);
		var sourceNode = nodes(sourceNodeid);
		color = color || "#000000";
		console.log("nodeid, nodefrom", node.id, node.from, "baseid:" + view.graph.bases[this.role].id);
		if(node.id !== view.graph.bases[this.role].id){
			console.log(node, node.from);
			if(!node.from){
				node.from = sourceNode.id;
				sourceNode.to.push(node.id);
			}else if(node.from && node.color !== sourceNode.color){
				var oldFrom = nodes(node.from);
				var toIndex = oldFrom.to.indexOf(node.id);
				if(~toIndex){
					oldFrom.to.splice(toIndex, 1)
				}
				node.from = sourceNode.id;
				sourceNode.to.push(node.id);

				var makeBlack = function(nodeId){
					var changeNode = queue(nodeId);
					changeNode.color = "#000000";
					//should flatten in the future, maybe
					changeNode.to.forEach(function(id){
						makeBlack(id);
					});
					changeNode.to.length = 0;
					changeNode.from = undefined;
				}
				for(var i = 0, l = node.to.length; i < l; i++){
					makeBlack(node.to.shift());
				}
			}
		}
		node.color = color;
		console.log("nodeid, nodefrom", node.id, node.from, "baseid:" + view.graph.bases[this.role].id);
		return node;
	}
	
	function Interface (game) {
		this.role = game.role;
		var color = game.board[this.role];
		this.playerColor = color;
		this.opponent = game.opponent;
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
		queue = view.graph.queueNodes,
		nodes = view.graph.nodes;
		RenderLoop(view);
		view.graph.bases = game.board.bases;
		view.graph.color = color;
		this.thread = new Thread(2, view.graph, this.claim.bind(this), this.role);
		var clickANode = function (func, event) {
			var node = event.data.node
			var links = node.links
			for(var i=0; i < links.length; i++){
				if(nodes(links[i]).color === this.playerColor){
					return func(node.id, links[i]);
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
		//
		// };

		// var hey = function (func, event) { 
		// 	var crawl = function(node) {
		// 		var crawled = [];
		// 		var queue = [];
		// 		var crawlLayer = function(claimedNode) {
		// 			queue = claimedNode.links.concat(queue);
		// 		};
		// 		crawlLayer(func(node));
		// 		var timeout = setInterval(function() {
		// 			if (queue.length === 0) window.clearInterval(timeout);
		// 			var n = queue.shift();
		// 			if (crawled.indexOf(n) === -1) {
		// 				crawlLayer(func(nodes(n)));
		// 				crawled.push(n);
		// 			}
		// 		}, 2);
		// 	};
		// 	crawl(event.data.node);
		// };

		// hey = hey.bind(this, this.claim.bind(this));
		clickANode = clickANode.bind(this, this.claim.bind(this));
		// clickANode = clickANode.bind(this);

		view.bind("clickNode", clickANode);

		var baseId = this.role === "host" ? game.board.bases.host.id : game.board.bases.client.id;
		var base = queue(baseId)
		base.color = color;
		base.from = baseId;
	}

	Interface.prototype.addOpponent = function (opponent) {
		this.opponent = opponent;
	};


	Interface.prototype.claim = function (nodeid, sourceNodeid) {
		var returnedNode = updateLinks.call(this, nodeid, this.playerColor, sourceNodeid);
		this.opponent.send({type: "claim", data: nodeid, color: this.playerColor, source: sourceNodeid});
		return returnedNode;
	};

	Interface.prototype.updateBoard = function (nodeid, color, sourceId) {
		updateLinks.call(this, nodeid, color, sourceId);
	};


	return Interface;
});

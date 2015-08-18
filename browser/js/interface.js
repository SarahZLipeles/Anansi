define(["js/Thread/Thread"], function (Thread) {
	
	"use strict";

	var view;

	function updateLinks(node, color, claiming, sourceNode){
		color = color || "#000000";
		node.color = color;
		if(!node.from && sourceNode){
			node.from = sourceNode.id;
			sourceNode.to.push(node.id);
		}
		var nodelinks = view.graph.nodes(node.links);
		for(var i = 0; i < nodelinks.length; i++){
			if(claiming){
				nodelinks[i].hidden = false;
			}
			if(nodelinks[i].color === color){
				// node.from.push(nodelinks[i].id)
				// nodelinks[i].to.push(node.id)
			}else if(nodelinks[i].color !== "#000000"){
				var isSource = nodelinks[i].from === node.id;
				if(isSource){
					updateLinks(nodelinks[i], color, true);
				}
			}
		}
		view.refresh({skipIndexation: true});
		return node;
	}

	// window.addEventListener("keyup", function(e) {
	// 	var keyCode = e.keyCode;
	// 	if (keyCode === 109) {
			
	// 	}
	// });
	
	function Interface (game) {
		var color = game.board[game.role];
		this.playerColor = color;
		this.opponent = game.opponent;
		view = new sigma({
					graph: game.board,
					renderers: [{
						container: document.getElementById("container"),
						type: "svg"
					}],
					settings: {
						drawLabels: false,
						player: color
					}
				});
		view.graph.bases = game.board.bases;
		view.graph.color = color;
		this.thread = new Thread(40, view.graph, this.claim.bind(this), game.role);
		// var clickANode = function (func, event) { func(event.data.node); };

		var clickANode = function(event){
			var claimedLinks = []
			this.thread.crawl(event.data.node.id, {
				start: function(id){
					this.attackNode('0', id)
				},
				receiveLinks: function(id, links){
					var self = this
					claimedLinks.push(id)
					links.forEach(function(link){
						if(claimedLinks.indexOf(link) === -1)
							self.attackNode(id, link)
					});
					// for(var i=(links.length - 1); i >= 0; i--){
					// 	if(claimedLinks.indexOf(links[i]) === -1){
					// 		self.attackNode(id, links[i])
					// 		break;
					// 	}
					// }
				}
			})

		}

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
		// clickANode = clickANode.bind(this, this.claim.bind(this));
		clickANode = clickANode.bind(this);

		view.bind("clickNode", clickANode);

		var baseId = game.role === "host" ? game.board.bases.host.id : game.board.bases.client.id;
		var base = view.graph.nodes(baseId);
			base.hidden = false;
			updateLinks(base, color, true);
	}

	Interface.prototype.addOpponent = function (opponent) {
		this.opponent = opponent;
	};


	Interface.prototype.claim = function (node, sourceNode) {
		var returnedNode = updateLinks(node, this.playerColor, true, sourceNode);
		// this.opponent.send({type: "claim", data: node.id, color: this.playerColor});
		return returnedNode;
	};

	Interface.prototype.updateBoard = function (nodeid, color) {
		var node = view.graph.nodes(nodeid);
		updateLinks(node, color, false);
	};


	return Interface;
});

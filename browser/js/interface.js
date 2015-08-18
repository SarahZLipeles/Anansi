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
			}
		}
		node.color = color;
		view.refresh({skipIndexation: true});
		return node;
	}

	
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
						// drawLabels: false,
						player: color,
						width: game.board.width,
						height: game.board.height
					}
				});
		console.log(view);
		view.graph.bases = game.board.bases;
		view.graph.color = color;
		this.thread1 = new Thread(2, view.graph, this.claim.bind(this), this.role);
		this.thread2 = new Thread(2, view.graph, this.claim.bind(this), this.role);
		this.threads = 2
		this.currentThread = 'thread1';
		this.state = 'attackNode'

		var self = this
		//controls
		window.addEventListener("keypress", function(e) {
			var keyCode = e.keyCode;
			var controls = {
				//cycle functions
				//a
				97: function(){
					self.state = 'attackNode'
				},
				//d
				100: function(){
					self.state = 'reinforceNode'
				},

				//cycle threads
				//w
				119: function(){
					var thread = self.currentThread
					var length = thread.length
					var num = parseInt(thread[length-1])
					if(++num > self.threads){
						num = 1
					}
					self.currentThread = "thread" + num
					console.log('switch to ' + self.currentThread)
				},
				//s
				115: function(){
					var thread = self.currentThread
					var length = thread.length
					var num = parseInt(thread[length-1])
					if(--num < 1){
						num = self.threads
					}
					self.currentThread = "thread" + num
					console.log('switch to ' + self.currentThread)
				},

				//num switch threads
				//1
				49: function(){
					self.currentThread = "thread1"
					console.log('switch to ' + self.currentThread)
				},

				//2
				50: function(){
					self.currentThread = "thread2"
					console.log('switch to ' + self.currentThread)
				},

				//3
				// 51:,

				//center to home
				//space
				// 32:,

				//toggle move base
				//t
				116: function(){
					self.state = 'moveBase'
				},

				//default
				'default': function(){
					console.log('Not a valid control')
				}
			}
			controls[keyCode]()
		});




		var clickANode = function (func, event) {
			if(this.state === 'attackNode'){
				// var node = event.data.node
				// var links = node.links
				// for(var i=0; i < links.length; i++){
				// 	if(view.graph.nodes(links[i]).color === this.playerColor){
				// 		return func(node, view.graph.nodes(links[i]));
				// 	}
				// }
				var claimedLinks = []
				var availableLinks = [];
				this[this.currentThread].crawl(event.data.node.id, {
					start: function(id){
						this.attackNode(view.graph.bases[game.role].id, id)
					},
					receiveLinks: function(id, links){
						//breadth first
						var self = this
						claimedLinks.push(id)
						links.forEach(function(link){
							if(claimedLinks.indexOf(link) === -1)
								self.attackNode(id, link)
						});

						//depth first
						// if (availableLinks.length !== 0) {
						// 	links.forEach(function(link) {
						// 		availableLinks.push({source: id, link: link})
						// 	})
						// 	var link = availableLinks.pop();
						// 	this.attackNode(link.source, link.link);

						// } else {
						// 	this.attackNode(id, links[0])
						// 	links.slice(1).forEach(function(link) {
						// 		availableLinks.push({source: id, link: link})
						// 	})
						// }
					}
				})
			}else if(this.state === 'reinforceNode'){
				this[this.currentThread].crawl(event.data.node.id, {
					start: function(id){
						this.reinforceNode(id)
					}
				})
			}else if(this.state === 'moveBase'){
				this[this.currentThread].moveBase(event.data.node.id)
				view.refresh()
			}
		};


		// var clickANode = function(event){
		// 	this.thread.moveBase(event.data.node.id);
		// 	view.refresh();
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
		// 				crawlLayer(func(view.graph.nodes(n)));
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

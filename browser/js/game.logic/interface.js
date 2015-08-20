define(["js/game.components/Thread", 
	"js/game.logic/renderloop.js", 
	"js/game.components/style",
	"js/game.logic/controls",
	"js/game.logic/setBases",
	"js/game.logic/updateNode"], 
	function (Thread, RenderLoop, style, setControls, setBases, UpdateBuilder) {
	
	"use strict";

	var view, queue, nodes, updateNode;

	function initGlobals (s) {
		console.log(s);
		view = s;
		queue = s.graph.queueNodes;
		nodes = s.graph.nodes;
		updateNode = UpdateBuilder(queue, nodes);
	}
	
	function Interface (game, playerData) {
		this.role = game.role; //"host or client"
		setBases(game, playerData);
		this.opponent = game.opponent; //peerconn
		initGlobals(new sigma(
			{
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
					host: game.role === "host" ? playerData.playerColor : playerData.opponentColor,
					client: game.role === "client" ? playerData.playerColor : playerData.opponentColor,
					player: game.role,
					width: game.board.width,
					height: game.board.height,
					defaultNodeColor: style.default,
					defaultEdgeColor: style.default
				}
			}
		));
		var self = this;
		//need to fix vvv
		RenderLoop(view); // fix this to only render when a node is inserted
		view.graph.bases = game.board.bases;
		view.graph.color = this.playerColor;
		var clickANode = function (func, event) {
			if(this.state === 'attackNode'){
				this[this.currentThread].crawl(event.data.node.id, {
					start: function(id){
						this.attackNode(self.source, id)
					},
					receiveLinks: function(id){
						self.source = id
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
				view.refresh({skipIndexation: true})
			}else if(this.state === 'selectSrc'){
				this.source = event.data.node.id
				console.log('selected a new source')
			}
		};
		view.bind("clickNode", clickANode.bind(this, this.claim.bind(this)));
		//need to fix ^^^
		view.refresh();
		this.initThreads(game.board);
		setControls(this);
	};

	Interface.prototype.initThreads = function (board) {
		this.currentThread = 'thread1';
		this.state = 'attackNode';
		this.source = board.bases[this.role].id;
		this.thread1 = new Thread(2, view.graph, this.claim.bind(this));
		this.thread2 = new Thread(2, view.graph, this.claim.bind(this));
		this.threads = 2;
	}

	Interface.prototype.claim = function (nodeid, sourceNodeid) {
		updateNode(nodeid, sourceNodeid);
		this.opponent.send({type: "claim", data: nodeid, source: sourceNodeid});
	};

	Interface.prototype.updateBoard = function (nodeid, sourceId) {
		updateNode.call(this, nodeid, sourceId);
	};


	return Interface;
});

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
						this.attackNode(self.source, id)
					},
					receiveLinks: function(id, links){
						self.source = id

						//breadth first
						// var self = this
						// claimedLinks.push(id)
						// links.forEach(function(link){
						// 	if(claimedLinks.indexOf(link) === -1)
						// 		self.attackNode(id, link)
						// });

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
				view.refresh({skipIndexation: true})
			}else if(this.state === 'selectSrc'){
				this.source = event.data.node.id
				console.log('selected a new source')
			}
		};


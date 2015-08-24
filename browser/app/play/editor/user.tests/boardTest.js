module.exports = function(self) {
	self.onmessage = test;
	var nodes = [{"id":"0","links":["2"],"health":50,"friendly":true,"enemy":false},{"id":"2","links":["0","3","4","5"],"health":10,"friendly":false,"enemy":false},{"id":"3","links":["0","6"],"health":10,"friendly":false,"enemy":false},{"id":"4","links":["0","6","7"],"health":10,"friendly":false,"enemy":false},{"id":"5","links":["0","8"],"health":10,"friendly":false,"enemy":false},{"id":"6","links":["2","4","9","1"],"health":10,"friendly":false,"enemy":false},{"id":"7","links":["4","1"],"health":10,"friendly":false,"enemy":false},{"id":"8","links":["5","1"],"health":10,"friendly":false,"enemy":false},{"id":"9","links":["6"],"health":10,"friendly":false,"enemy":false},{"id":"1","links":["6","7","8"],"health":50,"friendly":false,"enemy":true}];
	// console.log("called");
	var receive;
	var start;
	var data;
	var count = 1;
	var startTime = new Date();
	console.log(startTime);

	var findNode = function(id) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].id === id) {
				return nodes[i];
			}
		}
	};
	var userScope = {
		attack: function(sourceId, targetId) {
			if (findNode(sourceId).links.indexOf(targetId) !== -1) {
				var node = findNode(targetId);
				node.health--;
				if (node.health <= 0) {
					if(this.isFriend(targetId)){
						self.postMessage("killed friend: " + targetId);
						node.health = 20;
					} else {
						self.postMessage("claimed node: " + targetId);
						// console.log('node', node);
						// console.log('nodelinks', node.links);
						// console.log('count log', count);

						count++;
						if (count >= 10) {
							var endTime = new Date();
							self.postMessage("claimed all nodes");
							self.close();
						}
						node.health = 20;

						receive.call(this, {id: targetId, links: node.links}, data);
					}
					
				} else {
					// console.log('else running?');
					// console.log('else data', data);
					receive.call(this, {id: targetId, health: node.health}, data);
				}
			}
		},
		reinforce: function(targetId) {
			var node = findNode(targetId);
			if (!this.isFriend(targetId)) {
				self.postMessage("You reinforced a node you did not own: " + targetId);
			}
			if (node.health < 50) {
				node.health++;
			} else {
				self.postMessage("You tried to reinforce past full health" + targetId);
			}
			receive.call(this, {id: targetId, health: node.health}, data);
		},
		isEnemy: function(id) {
			return findNode(id).enemy;
		},
		isFriend: function (id) {
			return findNode(id).friendly;
		},
		isNeutral: function (id) {
			return !(findNode(id.friendly) && findNode(id.enemy));
		}
	};
	function test(e) {
		// console.log(e);
		start = eval(e.data[0]);
		receive = eval(e.data[1]);
		data = {};
		start.call(userScope, "2", data);
	}
};
var host = {id: 0, links: [1, 2], health: 50, maxHealth: 50, to: [], from: 0, owner: "host"},
	client = {id: 4, links: [3], health: 50, maxHealth: 50, to: [], from: 4, owner: "client"},
	node1 = {id: 1, links: [0, 2], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
	node2Con = {id: 2, links: [0, 1, 3], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
	node2NotCon = {id: 2, links: [0, 1], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
	node3Con = {id: 3, links: [2, 4], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
	node3NotCon = {id: 3, links: [4], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
	isolatedNode = {id: 5, links: [6], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
	otherisolatedNode = {id: 6, links: [5], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
	edgeA = {id: "a", source: 0, target: 1},
	edgeB = {id: "b", source: 2, target: 0},
	edgeC = {id: "c", source: 4, target: 3},
	edgeD = {id: "d", source: 1, target: 2},
	edgeEOption = {id: "e", source: 2, target: 3},
	isolatedEdge = {id: "f", source: 5, target: 6},
	connectedField = {
		nodes: [host, client, node1, node2Con, node3Con, isolatedNode, otherisolatedNode],
		edges: [edgeA, edgeB, edgeC, edgeD, edgeEOption, isolatedEdge],
		bases: {host: host.id, client: client.id}
	},
	unconnectedField = {
		nodes: [host, client, node1, node2NotCon, node3NotCon],
		edges: [edgeA, edgeB, edgeC, edgeD],
		bases: {host: host.id, client: client.id}
	};


module.exports = {
	connected: connectedField,
	unconnected: unconnectedField
};

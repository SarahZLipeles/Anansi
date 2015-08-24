// console.log('nodeId initial', nodeId);
data.currentNode = "0";
// console.log('currentNode initial', data);
attack("0", nodeId);


if (node.links) {
	// console.log('if');
    for (var i = 0; i < node.links.length; i++) {
        data.currentNode = node.id;
        attack(node.id, node.links[i]);
    }
} else {
	// console.log('else');
	// console.log('currentnode', data.currentNode);
	// console.log('nodeid', node.id);
    attack(data.currentNode, node.id);
}
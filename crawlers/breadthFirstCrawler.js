if(isFriend(nodeId)){
	data.source = nodeId;
	reinforce(data.source);
}else if(data.source){
	attack(data.source, nodeId);
}

if (node.links) {
    for (var i = 0; i < node.links.length; i++) {
        data.source = node.id;
        if (!isFriend(node.links[i])) attack(node.id, node.links[i]);
    }
} else {
    if (!isFriend(node.id)) attack(data.source, node.id);
}
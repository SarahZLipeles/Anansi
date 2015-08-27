if(isFriend(nodeId)){
	data.source = nodeId;
	reinforce(data.source);
}else if(data.source){
	attack(data.source, nodeId);
}
data.links = [];


var a = attack;
var f = isFriend;
function takeOver(node) {
	if (node.links) {
		console.log(node.links);
		data.source = node.id;
		for (var i = 0; i < node.links.length; i++) {
			if (!f(node.links[i])) break;
		}
		if (i === node.links.length && data.links.length > 0) takeOver(data.links.pop());
		data.links.push({id: node.id, links: node.links.slice(i)});
		a(node.id, node.links[i]);
	} else {
	    if (!f(data.source)) a(data.source, node.id);
	}
}
takeOver(node);
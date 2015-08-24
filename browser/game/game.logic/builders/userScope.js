function BuildUserScope (handler, thread){
    if (handler && thread) {
    	var {nodes, role} = handler.options;
    }
	var userScope = {
        attack: (source, target) => {
            handler.update({type: "attack", source, target, thread, role});
        },
        reinforce: (target) => {
            handler.update({type: "reinforce", target, thread, role});
        },
        isEnemy: (id) => {
        	try{
        		var node = nodes(id);
            	return node.owner && node.owner !== role;
        	}catch(e){
        		return false;
        	}
        },
        isFriend: (id) => {
        	try{
        		var node = nodes(id);
            	return node.owner && node.owner === role;
        	}catch(e){
        		return false;
        	}
        },
        isNeutral: (id) => {
            try{
        		var node = nodes(id);
            	return !node.owner;
        	}catch(e){
        		return false;
        	}
        }
    };
    return userScope;
}

module.exports = BuildUserScope;

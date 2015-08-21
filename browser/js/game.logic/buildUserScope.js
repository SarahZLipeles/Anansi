define([], function () {

	function BuildUserScope (handler, thread){
		var {nodes, role} = handler.options;
		var userScope = {
            attack: (source, target) => {
                handler.update({type: "attack", source, target, thread})
            },
            reinforce: (target) => {
                handler.update({type: "reinforce", target, thread})
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

	return BuildUserScope;
});

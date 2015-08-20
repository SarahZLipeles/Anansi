define([], function () {


	var attack = (data) => {
		var sourceId = data.source;
		var targetId = data.target;
		var source = nodes(sourceId);
		var target = nodes(targetId);
		if(source.links.indexOf(targetId) !== -1){
			if (target.health > 0) {
				target.health -= 5;
				console.log(target.health);
			}
			if (target.health <= 0) {
                // target.health = 6;
                claim(targetId, sourceId);
                //return links to player
                // currentCrawler.receiveLinks.call(userScope, targetId, target.links);
            }else{
            	// give back other info
            }
        }
    };

    
    var reinforce = (data) => {
    	var id = data.target;
    	if(nodes(id).color !== defaultColor){
    		var reinforce = function() {
    			var node = nodes(id);
    			if (node.health < node.maxHealth) {
    				node.health+=5;
    				console.log(node.health);
    				if(times){
    					crawlQ.push(reinforce.bind(null, --times));
    				}else if(times === undefined){
    					crawlQ.push(reinforce);
    				}
    			}
    		};
    		crawlQ.unshift(reinforce);
    	}
    };

    var removeOwner = (nodeId) => {
    	var changeNode = queue(nodeId);
    	changeNode.owner = undefined;
            //should flatten in the future, maybe
            changeNode.to.forEach((id) => {
            	removeOwner(id);
            });
            changeNode.to.length = 0;
            changeNode.from = undefined;
        };

        var claim = (nodeid, sourceNodeid) => {
        	var node = queue(nodeid);
        	var sourceNode = nodes(sourceNodeid);
        	var owner = sourceNode.owner;
            // if(node.id !== view.graph.bases[this.role].id){
            	if(!node.from){
            		node.from = sourceNode.id;
            		sourceNode.to.push(node.id);
            	}else if(node.from && node.owner !== owner){
            		var oldFrom = nodes(node.from);
            		var toIndex = oldFrom.to.indexOf(node.id);
            		if(~toIndex){
            			oldFrom.to.splice(toIndex, 1);
            		}
            		node.from = sourceNode.id;
            		sourceNode.to.push(node.id);
            		for(var i = 0, l = node.to.length; i < l; i++){
            			removeOwner(node.to.pop());
            		}
            	}
            // } 
            node.owner = owner;
        };

        //to fix
        // this.moveBase = function(id){
        //     var moveTo = nodes(id);
        //     var oldBase = nodes(graph.bases[role].id);
        //     if (oldBase.links.indexOf(id) !== -1/* && moveTo.color === graph.color*/) {
        //         oldBase.size = 0.03;
        //         oldBase.from = id;
        //         var index = moveTo.to.indexOf(id);
        //         oldBase.to.splice(index,1);

        //         moveTo.size = 0.15;
        //         moveTo.from = undefined;
        //         moveTo.to.push(oldBase.id);

        //         graph.bases[role] = moveTo;
        //     }
        // };

        return {
        	attack: attack,
        	reinforce: reinforce
        }
    });
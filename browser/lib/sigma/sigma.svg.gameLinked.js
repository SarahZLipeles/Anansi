;(function () {
    "use strict";
    sigma.utils.pkg("sigma.svg.nodes");

    /**
    * Custom game edge renderer
    */
    sigma.svg.nodes.gameLinked = {
    	update: function (node, nodeSVG, linkedNodes, settings) {
    		var player = settings("player");
    		var canSee = linkedNodes.some(function (link) {
    			return link.owner === player;
    		}) || node.owner === player;
    		nodeSVG.setAttributeNS(null, "display", canSee ? "block" : "none");
    	}
    }
})();


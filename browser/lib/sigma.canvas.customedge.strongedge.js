;(function() {
	'use strict';

	sigma.utils.pkg('sigma.canvas.edgehovers');

	/**
	* This hover renderer will display the edge with a different color or size.
	*
	* @param  {object}                   edge         The edge object.
	* @param  {object}                   source node  The edge source node.
	* @param  {object}                   target node  The edge target node.
	* @param  {CanvasRenderingContext2D} context      The canvas context.
	* @param  {configurable}             settings     The settings function.
	*/
	sigma.canvas.edges.gameEdge = function(edge, source, target, context, settings) {
		var color = edge.color,
		prefix = settings('prefix') || '',
		edgeColor = settings('edgeColor'),
		edgeType,
		defaultNodeColor = settings('defaultNodeColor'),
		defaultEdgeColor = settings('defaultEdgeColor'),
		sourceX, sourceY, targetX, targetY, halfX, halfY,
		headlen = 8, angle;
		console.log(target.trunk === source.id, source.trunk === target.id);
		if(target.trunk === source.id){
			edgeType = "toTarget";
		}else if(source.trunk === target.id){
			edgeType = "toSource";
		}

		if (!color){
			switch (edgeColor) {
				case 'source':
				color = source.color || defaultNodeColor;
				break;
				case 'target':
				color = target.color || defaultNodeColor;
				break;
				default:
				color = defaultEdgeColor;
				break;
			}
		}

		context.save();
		context.strokeStyle = color;
		context.lineWidth = edge[prefix + 'size'] || 1;
		context.beginPath();

		switch (edgeType){
		case "toSource":
			targetX = source[prefix + "x"];
			targetY = source[prefix + "y"];
			sourceX = target[prefix + "x"];
			sourceY = target[prefix + "y"];
		default:
			sourceX = source[prefix + "x"];
			sourceY = source[prefix + "y"];
			targetX = target[prefix + "x"];
			targetY = target[prefix + "y"];
		}
		console.log(edgeType);

		if(edgeType){		
			halfX = (sourceX + targetX) / 2,
			halfY = (sourceY + targetY) / 2,
			angle = Math.atan2(targetY - sourceY, targetX - sourceX);

			context.moveTo(
				halfX,
				halfY
				);
			context.lineTo(
				halfX - headlen * Math.cos(angle - Math.PI / 6),
				halfY - headlen * Math.sin(angle - Math.PI / 6)
				);
			context.moveTo(
				halfX,
				halfY
				);
			context.lineTo(
				halfX - headlen * Math.cos(angle + Math.PI / 6),
				halfY - headlen * Math.sin(angle + Math.PI / 6)
				);
		}

		context.moveTo(
			sourceX,
			sourceY
			);
		context.lineTo(
			targetX,
			targetY
			);

		context.stroke();

		context.restore();
	};

})();

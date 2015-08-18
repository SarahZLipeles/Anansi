;(function() {
    "use strict";

    sigma.utils.pkg("sigma.svg.edges");

    /**
    * Custom game edge renderer
    */
    sigma.svg.edges.gameEdge = {
        /**
        * SVG Element creation.
        *
        * @param  {object}                   edge       The edge object.
        * @param  {object}                   source     The source node object.
        * @param  {object}                   target     The target node object.
        * @param  {configurable}             settings   The settings function.
        */
        create: function(edge, source, target, settings) {
            var arrowContainer = document.getElementById("sigma-group-arrows");
            var color = edge.color,
            prefix = settings("prefix") || "",
            edgeColor = settings("edgeColor"),
            defaultNodeColor = settings("defaultNodeColor"),
            defaultEdgeColor = settings("defaultEdgeColor");

            if (!color){
                switch (edgeColor) {
                    case "source":
                    color = source.color || defaultNodeColor;
                    break;
                    case "target":
                    color = target.color || defaultNodeColor;
                    break;
                    default:
                    color = defaultEdgeColor;
                    break;
                }
            }
            //Calculate needed points
            var sourceX = source[prefix + "x"],
                sourceY = source[prefix + "y"],
                targetX = target[prefix + "x"],
                targetY = target[prefix + "y"],
                headlen = 4,
                halfX = (sourceX + targetX) / 2,
                halfY = (sourceY + targetY) / 2,
                angle = Math.atan2(targetY - sourceY, targetX - sourceX);
                var toSourceStartPoint = (halfX - headlen * Math.cos(angle - Math.PI / 6)) + "," + (halfY - headlen * Math.sin(angle - Math.PI / 6)),
                toSourceEndPoint = (halfX - headlen * Math.cos(angle + Math.PI / 6)) + "," + (halfY - headlen * Math.sin(angle + Math.PI / 6)),
                toTargetStartPoint = (halfX + headlen * Math.cos(angle - Math.PI / 6)) + "," + (halfY + headlen * Math.sin(angle - Math.PI / 6)),
                toTargetEndPoint = (halfX + headlen * Math.cos(angle + Math.PI / 6)) + "," + (halfY + headlen * Math.sin(angle + Math.PI / 6)),
                halfPoint = halfX + "," + halfY;
            //Create svg elements
            var line = document.createElementNS(settings("xmlns"), "line");
            var arrowToSource = document.createElementNS(settings("xmlns"), "polyline");
            var arrowToTarget = document.createElementNS(settings("xmlns"), "polyline");
            //Build point strings for arrows
            var toSourcePoints = toSourceStartPoint + " " + halfPoint + " " + toSourceEndPoint;
            var toTargetPoints = toTargetStartPoint + " " + halfPoint + " " + toTargetEndPoint;
            //Set up the to source arrow
            arrowToSource.setAttributeNS(null, "points", toSourcePoints);
            arrowToSource.setAttributeNS(null, "class", settings("classPrefix") + "-arrow");
            arrowToSource.setAttributeNS(null, "stroke", color);
            arrowToSource.setAttributeNS(null, "fill", "none");
            arrowToSource.setAttributeNS(null, "display", "none");
            //Set up the to target arrow
            arrowToTarget.setAttributeNS(null, "points", toTargetPoints);
            arrowToTarget.setAttributeNS(null, "class", settings("classPrefix") + "-arrow");
            arrowToTarget.setAttributeNS(null, "stroke", color);
            arrowToTarget.setAttributeNS(null, "fill", "none");
            arrowToTarget.setAttributeNS(null, "display", "none");
            //Add arrows to board
            arrowContainer.appendChild(arrowToTarget);
            arrowContainer.appendChild(arrowToSource);
            //Setting up the line attributes
            line.setAttributeNS(null, "data-edge-id", edge.id);
            line.setAttributeNS(null, "class", settings("classPrefix") + "-edge");
            line.setAttributeNS(null, "stroke", color);
            line.setAttributeNS(null, "display", "none");
            //Took this from below, makes dragging and zooming possible
            //Would need to put this back to reenable that
            line.setAttributeNS(null, "stroke-width", edge[prefix + "size"] || 1);
            line.setAttributeNS(null, "x1", sourceX);
            line.setAttributeNS(null, "y1", sourceY);
            line.setAttributeNS(null, "x2", targetX);
            line.setAttributeNS(null, "y2", targetY);

            edge.arrows = {toSource: arrowToSource, toTarget: arrowToTarget};
            return line;
        },

    /**
    * SVG Element update.
    *
    * @param  {object}                   edge       The edge object.
    * @param  {DOMElement}               line       The line DOM Element.
    * @param  {object}                   source     The source node object.
    * @param  {object}                   target     The target node object.
    * @param  {configurable}             settings   The settings function.
    */
    update: function(edge, line, source, target, settings) {
        var sourceColor = source.color,
            targetColor = target.color,
            player = settings("player");
        if(sourceColor !== "#000000" && targetColor === sourceColor){// && !edge.arrow){
            line.setAttributeNS(null, "stroke", sourceColor);
            edge.color = sourceColor;
            //toSource
            if(target.from === source.id){
                if(sourceColor === player){
                    edge.arrows.toSource.setAttributeNS(null, "stroke", sourceColor);
                    edge.arrows.toSource.setAttributeNS(null, "display", "block");
                }
            //toTarget
            }else if(source.from === target.id){
                if(sourceColor === player){
                    edge.arrows.toTarget.setAttributeNS(null, "stroke", sourceColor);
                    edge.arrows.toTarget.setAttributeNS(null, "display", "block");
                }
            }
        }else if(edge.color !== "#000000"){
            console.log("hey")
            line.setAttributeNS(null, "stroke", "#000000");
            edge.arrows.toSource.setAttributeNS(null, "display", "none");
            edge.arrows.toTarget.setAttributeNS(null, "display", "none");
            edge.color = "#000000";
        }
        if(targetColor !== player && sourceColor !== player){
                line.setAttributeNS(null, "display", "none");
        }
        if(targetColor === player || sourceColor === player){
            line.setAttributeNS(null, "display", "block");
        }

        return this;
    }
    };
})();
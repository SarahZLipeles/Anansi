(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

  function setHealth(circle, node, r){
    var c = Math.PI*(r*2);
    var ratio = node.health / node.maxHealth
    var strokeOffset = (1 - ratio) * c;  
    if(ratio === 0){
      circle.setAttributeNS(null, 'stroke','none');
    } else{
      if(ratio === 1){
        circle.setAttributeNS(null, 'stroke-dasharray', 0);
      }else{
        circle.setAttributeNS(null, 'stroke-dasharray', c);
      }

      if(ratio > 0.5){
        circle.setAttributeNS(null, 'stroke','green');
      } else if(ratio > 0.25){
        circle.setAttributeNS(null, 'stroke','yellow');
      } else{
        circle.setAttributeNS(null, 'stroke','red');
      }

      circle.setAttributeNS(null, 'stroke-width', 3.25);
      circle.setAttributeNS(null, 'stroke-dashoffset', strokeOffset);
      // circle.setAttributeNS(null, 'transition', 'stroke-dashoffset 1s linear')
    }
  }

  /**
   * The default node renderer. It renders the node as a simple disc.
   */
  sigma.svg.nodes.gameNode = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node     The node object.
     * @param  {configurable}             settings The settings function.
     */
    create: function(node, settings) {
      var prefix = settings('prefix') || '',
          circle = document.createElementNS(settings('xmlns'), 'circle');

      var r = node[prefix + 'size'];
      
      // Defining the node's circle
      circle.setAttributeNS(null, 'data-node-id', node.id);
      circle.setAttributeNS(null, 'class', settings('classPrefix') + '-node');
      circle.setAttributeNS(null, 'fill', node.owner ? settings(node.owner) : settings('defaultNodeColor'));
      setHealth(circle, node, r)

      // Taken from below, part of disabling resize readjustment
      circle.setAttributeNS(null, 'cx', node[prefix + 'x']);
      circle.setAttributeNS(null, 'cy', node[prefix + 'y']);
      circle.setAttributeNS(null, 'r', r);
      circle.setAttributeNS(null, "display", node.owner === settings("player") ? "block" : "none");

      // Returning the DOM Element
      return circle;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   node     The node object.
     * @param  {DOMElement}               circle   The node DOM element.
     * @param  {configurable}             settings The settings function.
     */
    update: function(node, circle, settings) {
      // var player = settings("player");
      // Updating only if not freestyle
      var r = parseInt(circle.getAttribute('r'))
      setHealth(circle, node, r)

      circle.setAttributeNS(null, 'fill', node.owner ? settings(node.owner) : settings('defaultNodeColor'));
      
      circle.style.display = '';

      return this;
    }
  };
})();

var gameSettings = require('../../settings.js')

(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

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
      var c = Math.PI*(r*2);
      var strokeOffset = node.health / node.maxHealth * c;

      // Defining the node's circle
      circle.setAttributeNS(null, 'data-node-id', node.id);
      circle.setAttributeNS(null, 'class', settings('classPrefix') + '-node');
      circle.setAttributeNS(null, 'fill', node.owner ? settings(node.owner) : settings('defaultNodeColor'));
      circle.setAttributeNS(null, 'stroke','#C0AFD9');
      circle.setAttributeNS(null, 'stroke-dasharray', c);
      circle.setAttributeNS(null, 'stroke-width', 1.25);
      circle.setAttributeNS(null, 'stroke-dashoffset', strokeOffset);
      circle.setAttributeNS(null, 'transition', 'stroke-dashoffset 1s linear')

      // Taken from below, part of disabling resize readjustment
      circle.setAttributeNS(null, 'cx', node[prefix + 'x']);
      circle.setAttributeNS(null, 'cy', node[prefix + 'y']);
      circle.setAttributeNS(null, 'r', r);

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
      var c = Math.PI*(parseInt(circle.getAttribute('r'))*2);
      var strokeOffset = node.health / node.maxHealth * c;

      circle.setAttributeNS(null, 'stroke-dashoffset', strokeOffset);
      circle.setAttributeNS(null, 'fill', node.owner ? settings(node.owner) : settings('defaultNodeColor'));
      
      circle.style.display = '';

      return this;
    }
  };
})();

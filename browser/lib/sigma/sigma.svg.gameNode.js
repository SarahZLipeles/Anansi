define([], function () {

return function(style) {
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

      // Defining the node's circle
      circle.setAttributeNS(null, 'data-node-id', node.id);
      circle.setAttributeNS(null, 'class', settings('classPrefix') + '-node');
      circle.setAttributeNS(null, 'fill', node.color || settings('defaultNodeColor'));

      // Taken from below, part of disabling resize readjustment
      circle.setAttributeNS(null, 'cx', node[prefix + 'x']);
      circle.setAttributeNS(null, 'cy', node[prefix + 'y']);
      circle.setAttributeNS(null, 'r', node[prefix + 'size']);

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
      if (!settings('freeStyle'))
        circle.setAttributeNS(null, 'fill', node.color || settings('defaultNodeColor'));
      // Showing
      circle.style.display = '';

      return this;
    }
  };
};
});

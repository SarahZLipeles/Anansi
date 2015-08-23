(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.labels');

  /**
   * The default label renderer. It renders the label as a simple text.
   */sigma.svg.labels.def
   = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node       The node object.
     * @param  {configurable}             settings   The settings function.
     */
    create: function(node, settings) {
      var prefix = settings('prefix') || '',
          health = document.createElementNS(settings('xmlns'), 'circle');
      // Defining the node's circle
      health.setAttributeNS(null, 'data-node-id', node.id+'-health');
      health.setAttributeNS(null, 'class', settings('classPrefix') + '-nodeHealth');
      health.setAttributeNS(null, 'fill', '#fff333');
      health.setAttributeNS(null, 'stroke','#fff333');
      health.setAttributeNS(null, 'stroke-width', 1.25);
      health.setAttributeNS(null, 'stroke-dasharray', 565.48);
      health.setAttributeNS(null, 'stroke-dashoffset', 0);
      // Taken from below, part of disabling resize readjustment
      health.setAttributeNS(null, 'cx', node[prefix + 'x']);
      health.setAttributeNS(null, 'cy', node[prefix + 'y']);
      health.setAttributeNS(null, 'r', node[prefix + 'size']);

      return health;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   node     The node object.
     * @param  {DOMElement}               text     The label DOM element.
     * @param  {configurable}             settings The settings function.
     */
    update: function() {
      // var prefix = settings('prefix') || '',
      //     size = node[prefix + 'size'];

      // var fontSize = (settings('labelSize') === 'fixed') ?
      //   settings('defaultLabelSize') :
      //   settings('labelSizeRatio') * size;

      // // Case when we don't want to display the label
      // if (!settings('forceLabels') && size < settings('labelThreshold'))
      //   return;

      // if (typeof node.label !== 'string')
      //   return;

      // // Updating
      // text.setAttributeNS(null, 'x',
      //   Math.round(node[prefix + 'x'] + size + 3));
      // text.setAttributeNS(null, 'y',
      //   Math.round(node[prefix + 'y'] + fontSize / 3));

      // // Showing
      // text.style.display = '';

      return this;
    }
  };
})();
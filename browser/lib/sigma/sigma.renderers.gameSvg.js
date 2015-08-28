require("../arrayMethods");

;(function () {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof conrad === 'undefined')
    throw 'conrad is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.renderers');

  /**
   * This function is the constructor of the svg sigma's renderer.
   *
   * @param  {sigma.classes.graph}            graph    The graph to render.
   * @param  {sigma.classes.camera}           camera   The camera.
   * @param  {configurable}           settings The sigma instance settings
   *                                           function.
   * @param  {object}                 object   The options object.
   * @return {sigma.renderers.gameSvg}             The renderer instance.
   */
  sigma.renderers.gameSvg = function(graph, camera, settings, options) {
    if (typeof options !== 'object')
      throw 'sigma.renderers.gameSvg: Wrong arguments.';

    if (!(options.container instanceof HTMLElement))
      throw 'Container not found.';

    var i,
        l,
        a,
        fn;

    sigma.classes.dispatcher.extend(this);

    // Initialize main attributes:
    this.graph = graph;
    this.width = settings("width");
    this.height = settings("height");
    this.camera = camera;
    this.domElements = {
      graph: null,
      groups: {},
      nodes: {},
      edges: {},
      labels: {},
      hovers: {}
    };
    this.measurementCanvas = null;
    this.options = options;
    this.container = this.options.container;
    this.settings = (
        typeof options.settings === 'object' &&
        options.settings
      ) ?
        settings.embedObjects(options.settings) :
        settings;

    // Is the renderer meant to be freestyle?
    this.settings('freeStyle', !!this.options.freeStyle);

    // SVG xmlns
    this.settings('xmlns', 'http://www.w3.org/2000/svg');

    // Indexes:
    this.nodesOnScreen = [];
    this.edgesOnScreen = [];

    // Find the prefix:
    this.options.prefix = 'renderer' + sigma.utils.id() + ':';

    // Initialize the DOM elements
    this.initDOM('svg');

    // Initialize captors:
    this.captors = [];
    a = this.options.captors || [sigma.captors.mouse, sigma.captors.touch];
    for (i = 0, l = a.length; i < l; i++) {
      fn = typeof a[i] === 'function' ? a[i] : sigma.captors[a[i]];
      this.captors.push(
        new fn(
          this.domElements.graph,
          this.camera,
          this.settings
        )
      );
    }

    // Deal with sigma events:
    // TODO: keep an option to override the DOM events?
    sigma.misc.bindDOMEvents.call(this, this.domElements.graph);
    // this.bindHovers(this.options.prefix);

    // Set size
    this.setSize(this.width, this.height);
  };

  /**
   * This method renders the graph on the svg scene.
   *
   * @param  {?object}                options Eventually an object of options.
   * @return {sigma.renderers.gameSvg}            Returns the instance itself.
   */
  sigma.renderers.gameSvg.prototype.render = function(options) {
    options = options || {};

    var a,
        i,
        e,
        l,
        o,
        source,
        target,
        renderers,
        subrenderers,
        index = {},
        graph = this.graph,
        nodes = this.graph.nodes,
        drawEdges = this.settings(options, 'drawEdges'),
        drawNodes = this.settings(options, 'drawNodes'),
        embedSettings = this.settings.embedObjects(options, {
          prefix: this.options.prefix,
          forceLabels: this.options.forceLabels
        });

    // Check the 'hideEdgesOnMove' setting:
    if (this.settings(options, 'hideEdgesOnMove'))
      if (this.camera.isAnimated || this.camera.isMoving)
        drawEdges = false;

    // Apply the camera's view:
    this.camera.applyView(
      undefined,
      this.options.prefix,
      {
        width: this.width,
        height: this.height
      }
    );

    // Hiding everything
    // TODO: find a more sensible way to perform this operation

    // *** NOTE: disabled these to manually hide and show everything
    // this.hideDOMElements(this.domElements.nodes);
    // this.hideDOMElements(this.domElements.edges);
    // this.hideDOMElements(this.domElements.labels);

    // Find which nodes are on screen
    this.edgesOnScreen = [];
    this.nodesOnScreen = this.camera.quadtree.area(
      this.camera.getRectangle(this.width, this.height)
    );

    // Node index
    for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++)
      index[a[i].id] = a[i];

    // Find which edges are on screen
    for (a = graph.edges(), i = 0, l = a.length; i < l; i++) {
      o = a[i];
      if (
        (index[o.source] || index[o.target]) &&
        (!o.hidden && !nodes(o.source).hidden && !nodes(o.target).hidden)
      )
        this.edgesOnScreen.push(o);
    }

    // Display nodes
    //---------------
    subrenderers = sigma.svg.labels;
    renderers = sigma.svg.nodes;

    //-- First we create the nodes which are not already created
    if (drawNodes)
      for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++) {
        if (!a[i].hidden && !this.domElements.nodes[a[i].id]) {

          // Label
          e = (subrenderers[a[i].type] || subrenderers.def).create(
            a[i],
            embedSettings
          );

          this.domElements.labels[a[i].id] = e;
          this.domElements.groups.labels.appendChild(e);

          // Node
          e = (renderers[a[i].type] || renderers.def).create(
            a[i],
            embedSettings
          );

          this.domElements.nodes[a[i].id] = e;
          this.domElements.groups.nodes.appendChild(e);

        }
      }

    //-- Second we update the nodes
    if (drawNodes){
      for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++) {

        if (a[i].hidden)
          continue;

        // // Label
        // (subrenderers[a[i].type] || subrenderers.def).update(
        //   a[i],
        //   this.domElements.labels[a[i].id],
        //   embedSettings
        // );

        // Node
        (renderers[a[i].type] || renderers.def).update(
          a[i],
          this.domElements.nodes[a[i].id],
          embedSettings
        );
      }
      var linkedNodesToUpdate = this.nodesOnScreen.filter(function(node){
        return node.owner;
      }).map(function (node) {
        return nodes(node.links);
      }).reduce(function (output, entry){
        return output.concat(entry);
      }, []).getUniqueNodes();
      //lift the fog of war ~~~~~
      var linked, links;
       //lift the fog of war ~~~~~
       for (a = linkedNodesToUpdate, i = 0, l = a.length; i < l; i++) {
        linked = a.pop();
        links = nodes(linked.links);
        renderers.gameLinked.update(
          linked,
          this.domElements.nodes[linked.id],
          links,
          embedSettings
          );
      }
    }

    // Display edges
    //---------------
    renderers = sigma.svg.edges;

    //-- First we create the edges which are not already created
    if (drawEdges){
      for (a = this.edgesOnScreen, i = 0, l = a.length; i < l; i++) {
        if (!this.domElements.edges[a[i].id]) {
          source = nodes(a[i].source);
          target = nodes(a[i].target);

          e = (renderers[a[i].type] || renderers.def).create(
            a[i],
            source,
            target,
            embedSettings
            );

          this.domElements.edges[a[i].id] = e;
          this.domElements.groups.edges.appendChild(e);
        }
      }
    }

    //-- Second we update the edges
    if (drawEdges){
      for (a = this.edgesOnScreen, i = 0, l = a.length; i < l; i++) {
        source = nodes(a[i].source);
        target = nodes(a[i].target);

        (renderers[a[i].type] || renderers.def).update(
          a[i],
          this.domElements.edges[a[i].id],
          source,
          this.domElements.nodes[source.id],
          target,
          this.domElements.nodes[target.id],
          embedSettings
        );
       }


      
    }

    this.dispatchEvent('render');

    return this;
  };


  /**
   * This method renders the graph on the svg scene, but only the nodes that need an update.
   *
   * @param  {?object}                options Eventually an object of options.
   * @return {sigma.renderers.gameSvg}            Returns the instance itself.
   */
  sigma.renderers.gameSvg.prototype.renderUpdate = function(options) {
    options = options || {};
    var a,
        i,
        l,
        o,
        source,
        target,
        renderers,
        index = {},
        claim = options.claim,
        graph = this.graph,
        nodes = this.graph.nodes,
        renderNodes = graph.queueNodes(),
        nodesToUpdate = renderNodes.nodesToUpdate,
        attacks = renderNodes.attacks,
        edgeAttacks = [],
        edgesToUpdate = [],
        linkedNodesToUpdate = [],
        embedSettings = this.settings.embedObjects(options, {
          prefix: this.options.prefix,
          forceLabels: this.options.forceLabels
        });

    // Apply the camera's view:
    this.camera.applyView(
      undefined,
      this.options.prefix,
      {
        width: this.width,
        height: this.height
      }
    );
    if(claim){
      linkedNodesToUpdate = nodesToUpdate.map(function (node) {
            return nodes(node.links);
          }).reduce(function (output, entry){
            return output.concat(entry);
          }, []).getUniqueNodes();
    }

    // Node index
    for (a = nodesToUpdate, i = 0, l = a.length; i < l; i++){
      index[a[i].id] = a[i];
    }

    // Find which edges need to be updated
    // Could probably speed up the game by doing 
    // this in the loop where you submit nodes to update
    var j = 0, attackLen = attacks.length, attack;
    for (a = graph.edges(), i = 0, l = a.length; i < l; i++) {
      o = a[i];
      if (index[o.source] || index[o.target]){
        for(j = 0; j < attacks.length; j++){
          attack = attacks[j];
          if(attack.source === o.source && attack.target === o.target || attack.source === o.target && attack.target === o.source){
            attacks.splice(j--, 1);
            edgeAttacks.push({target: attack.target, source: attack.source, edge: o});
          }
        }
        edgesToUpdate.push(o);
      }
    }

    for(a = edgesToUpdate, i = 0, l = a.length; i < l; i++){
      o = a[i];

    }

    // Display nodes
    //---------------
    renderers = sigma.svg.nodes;

    var node;

    //-- We update the nodes
    for (a = nodesToUpdate, i = 0, l = a.length; i < l; i++) {
      // Node
      node = a.pop();

      renderers.gameNode.update(
        node,
        this.domElements.nodes[node.id],
        embedSettings
      );
    }

    if(claim){
      var linked, links;
       //lift the fog of war ~~~~~
       for (a = linkedNodesToUpdate, i = 0, l = a.length; i < l; i++) {
        linked = a.pop();
        links = nodes(linked.links);
        renderers.gameLinked.update(
          linked,
          this.domElements.nodes[linked.id],
          links,
          embedSettings
        );
       }
      }


    // Display edges
    //---------------
    renderers = sigma.svg.edges;
    var edge;
    //-- We update the edges
    for (a = edgesToUpdate, i = 0, l = a.length; i < l; i++) {
      edge = a.pop();
      source = nodes(edge.source);
      target = nodes(edge.target);

      renderers.gameEdge.update(
        edge,
        this.domElements.edges[edge.id],
        source,
        this.domElements.nodes[source.id],
        target,
        this.domElements.nodes[target.id],
        embedSettings
      );
     }
    for(a = edgeAttacks, i = 0, l = a.length; i < l; i++){
      attack = a.pop();
      renderers.gameAttack.update(
        attack.target,
        attack.source,
        attack.edge,
        this.domElements.edges[attack.edge.id],
        embedSettings
      );
    }

    this.dispatchEvent('render');

    return this;
  };

  /**
   * This method creates a DOM element of the specified type, switches its
   * position to "absolute", references it to the domElements attribute, and
   * finally appends it to the container.
   *
   * @param  {string} tag The label tag.
   * @param  {string} id  The id of the element (to store it in "domElements").
   */
  sigma.renderers.gameSvg.prototype.initDOM = function(tag) {
    var dom = document.createElementNS(this.settings('xmlns'), tag),
        c = this.settings('classPrefix'),
        g,
        l,
        i;

    dom.style.position = 'absolute';
    dom.setAttribute('class', c + '-svg');

    // Setting SVG namespace
    dom.setAttribute('xmlns', this.settings('xmlns'));
    dom.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    dom.setAttribute('version', '1.1');

    // Creating the measurement canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute('class', c + '-measurement-canvas');

    // Appending elements
    this.domElements.graph = this.container.appendChild(dom);

    // Creating groups
    var groups = ['edges', 'labels', 'nodes', 'hovers', "arrows"];
    for (i = 0, l = groups.length; i < l; i++) {
      g = document.createElementNS(this.settings('xmlns'), 'g');

      g.setAttributeNS(null, 'id', c + '-group-' + groups[i]);
      g.setAttributeNS(null, 'class', c + '-group');

      this.domElements.groups[groups[i]] =
        this.domElements.graph.appendChild(g);
    }

    // Appending measurement canvas
    this.container.appendChild(canvas);
    this.measurementCanvas = canvas.getContext('2d');
  };

  /**
   * This method hides a batch of SVG DOM elements.
   *
   * @param  {array}                  elements  An array of elements to hide.
   * @param  {object}                 renderer  The renderer to use.
   * @return {sigma.renderers.gameSvg}              Returns the instance itself.
   */
  sigma.renderers.gameSvg.prototype.hideDOMElements = function(elements) {
    var o,
        i;

    for (i in elements) {
      o = elements[i];
      sigma.svg.utils.hide(o);
    }

    return this;
  };

  /**
   * This method binds the hover events to the renderer.
   *
   * @param  {string} prefix The renderer prefix.
   */
  // TODO: add option about whether to display hovers or not
  // sigma.renderers.gameSvg.prototype.bindHovers = function(prefix) {
  //   var renderers = sigma.svg.hovers,
  //       self = this,
  //       hoveredNode;

  //   function overNode(e) {
  //     if(e.data.node){
  //       var node = e.data.node,
  //           embedSettings = self.settings.embedObjects({
  //             prefix: prefix
  //           });

  //       if (!embedSettings('enableHovering'))
  //         return;

  //       var hover = (renderers[node.type] || renderers.def).create(
  //         node,
  //         self.domElements.nodes[node.id],
  //         self.measurementCanvas,
  //         embedSettings
  //       );

  //       self.domElements.hovers[node.id] = hover;

  //       // Inserting the hover in the dom
  //       self.domElements.groups.hovers.appendChild(hover);
  //       hoveredNode = node;
  //     }
  //   }

  //   function outNode(e) {
  //     if(e.data.node){
  //       var node = e.data.node,
  //           embedSettings = self.settings.embedObjects({
  //             prefix: prefix
  //           });

  //       if (!embedSettings('enableHovering'))
  //         return;

  //       // Deleting element
  //       self.domElements.groups.hovers.removeChild(
  //         self.domElements.hovers[node.id]
  //       );
  //       hoveredNode = null;
  //       delete self.domElements.hovers[node.id];

  //       // Reinstate
  //       self.domElements.groups.nodes.appendChild(
  //         self.domElements.nodes[node.id]
  //       );
  //     }
  //   }

  //   // OPTIMIZE: perform a real update rather than a deletion
  //   function update() {
  //     if (!hoveredNode)
  //       return;

  //     var embedSettings = self.settings.embedObjects({
  //           prefix: prefix
  //         });

  //     // Deleting element before update
  //     self.domElements.groups.hovers.removeChild(
  //       self.domElements.hovers[hoveredNode.id]
  //     );
  //     delete self.domElements.hovers[hoveredNode.id];

  //     var hover = (renderers[hoveredNode.type] || renderers.def).create(
  //       hoveredNode,
  //       self.domElements.nodes[hoveredNode.id],
  //       self.measurementCanvas,
  //       embedSettings
  //     );

  //     self.domElements.hovers[hoveredNode.id] = hover;

  //     // Inserting the hover in the dom
  //     self.domElements.groups.hovers.appendChild(hover);
  //   }

  //   // Binding events
  //   this.bind('overNode', overNode);
  //   this.bind('outNode', outNode);

  //   // Update on render
  //   this.bind('render', update);
  // };

  /**
   * This method sets the size of each DOM element in the container and stores the new
   * dimensions. Then, it renders the graph.
   *
   * @param  {?number}                width  The width of the container.
   * @param  {?number}                height The height of the container.
   * @return {sigma.renderers.gameSvg}           Returns the instance itself.
   */
  sigma.renderers.gameSvg.prototype.setSize = function(w, h) {

    this.domElements.graph.style.width = w + 'px';
    this.domElements.graph.style.height = h + 'px';

    this.domElements.graph.setAttribute('width', w);
    this.domElements.graph.setAttribute('height', h);

    return this;
  };

  sigma.renderers.svg.prototype.resize = function(w, h) {
    var oldWidth = this.width,
        oldHeight = this.height,
        pixelRatio = 1;

    if (w !== undefined && h !== undefined) {
      this.width = w;
      this.height = h;
    } else {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;

      w = this.width;
      h = this.height;
    }

    if (oldWidth !== this.width || oldHeight !== this.height) {
      this.domElements.graph.style.width = w + 'px';
      this.domElements.graph.style.height = h + 'px';

      if (this.domElements.graph.tagName.toLowerCase() === 'svg') {
        this.domElements.graph.setAttribute('width', (w * pixelRatio));
        this.domElements.graph.setAttribute('height', (h * pixelRatio));
      }
    }
  }


  /**
   * The labels, nodes and edges renderers are stored in the three following
   * objects. When an element is drawn, its type will be checked and if a
   * renderer with the same name exists, it will be used. If not found, the
   * default renderer will be used instead.
   *
   * They are stored in different files, in the "./svg" folder.
   */
  sigma.utils.pkg('sigma.svg.nodes');
  sigma.utils.pkg('sigma.svg.edges');
  sigma.utils.pkg('sigma.svg.labels');
})();
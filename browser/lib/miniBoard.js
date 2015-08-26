
(function(c, b, a, e) {
    var d = {
        navigatorClass: "boardNav",
        viewportClass: "boardNavView",
        elements: false,
        liveScroll: false,
        scrollbarWidth: 20,
        defaultBgColor: "black",
        draggable: false,
        resizable: false,
        debug: false,
        realistic: false,
        html2canvas: {},
        forceDom: false
    };
    var f = function(h, g) {
        this.elem = h;
        this.$elem = c(h);
        // if (this.elem == b) {
        //     this.$relElem = c("body")
        // } else {
        //     this.$relElem = this.$elem
        // }
        this.options = g;
        this.metadata = this.$elem.data("boardNav-options");
        this.config = c.extend({}, d, this.options, this.metadata);
        this.init();
        this.$elem.data("boardNav-instance", this);
        this.updating = false
    };
    f.prototype.init = function() {
        var g = this;
        this.$navigator = c('<div class="' + this.config.navigatorClass + '"><canvas></canvas><div class="' + this.config.viewportClass + '"></div></div>').appendTo("body");
        this.navigatorPosition = this.$navigator.css("position");
        this.$canvas = this.$navigator.find("canvas");
        var h = this.$canvas.get(0);
        this.canvasSupported = !this.config.forceDom && h.getContext && h.getContext("2d");
        if (this.canvasSupported) {
            this.ctx = this.$canvas.get(0).getContext("2d")
        } else {
            this.$canvas.remove();
            this.$canvasDom = c('<div class="boardCanvasDOM">').appendTo(this.$navigator)
        }
        this.$viewport = this.$navigator.find("." + this.config.viewportClass);
        this.attachEvents();
        this.update()
    };
    f.prototype.update = function(g) {
        if (this.updating) {
            this.debug("REJECTED, already updating");
            return false
        }
        this.updating = true;
        if (g) {
            this.updateViewport();
            this.updating = false
        } else {
            this.updateSizes();
            this.updateViewport();
            if (false !== this.drawElements()) {
                this.updating = false
            }
        }
    };
    f.prototype.updateSizes = function() {
        var g = this;
        g.debug("updating navigator sizes");
        if (this.elem == b) {
            var h = c(a).width(),
                i = c(a).height();
            this.boardLeft = 0;
            this.boardTop = 0;
            this.scrollTop = 0;
            this.scrollLeft = 0
        } else {
            var h = this.elem.scrollWidth + this.config.scrollbarWidth,
                i = this.elem.scrollHeight + this.config.scrollbarWidth;
            this.boardLeft = this.$elem.offset().left;
            this.boardTop = this.$elem.offset().top;
            this.scrollTop = this.$elem.scrollTop();
            this.scrollLeft = this.$elem.scrollLeft()
        }
        this.ratio = this.$navigator.width() / h;
        var j = h * this.ratio,
            k = i * this.ratio;
        if (this.config.maxHeight && k > this.config.maxHeight) {
            k = this.config.maxHeight;
            this.ratio = k / i;
            j = h * this.ratio
        }
        this.$navigator.width(j).height(k);
        this.$canvas.attr("width", j).attr("height", k);
        this.debug({
            scrollTop: this.scrollTop,
            scrollLeft: this.scrollLeft,
            width: h,
            height: i,
            boardTop: this.boardTop,
            boardLeft: this.boardLeft
        })
    };
    f.prototype.updateViewport = function() {
        this.debug("update viewport");
        var g = this.$elem.height(),
            h = this.$elem.width(),
            j = this.$elem.scrollTop(),
            i = this.$elem.scrollLeft();
        this.debug({
            width: h,
            height: g,
            top: j,
            left: i
        });
        this.$viewport.css({
            left: i * this.ratio,
            top: j * this.ratio
        }).width(h * this.ratio).height(g * this.ratio)
    };
    f.prototype.scrolled = function(h) {
        var g = this;
        g.debug("viewport scrolled");
        g.debug(h);
        g.$elem.scrollTop(h.top / g.ratio).scrollLeft(h.left / g.ratio)
    };
    f.prototype.attachEvents = function() {
        var g = this;
        this.scrolling = false;
        this.resizing = false;
        if (this.config.draggable) {
            this.$navigator.append('<div class="boardNavHandle"></div>').draggable({
                handle: "div.boardNavHandle",
                stop: function(h, i) {
                    g.$navigator.css("position", g.navigatorPosition)
                }
            })
        }
        if (this.config.resizable) {
            this.$navigator.resizable({
                aspectRatio: true,
                helper: "boardNavResize",
                start: function(h, i) {
                    g.resizing = true
                },
                stop: function(h, i) {
                    g.debug("navigator resized");
                    g.update();
                    g.resizing = false;
                    g.$navigator.css("position", g.navigatorPosition)
                }
            })
        }
        this.$navigator.click(function(i) {
            var l = i.pageX - c(this).offset().left - g.$viewport.width() / 2,
                k = i.pageY - c(this).offset().top - g.$viewport.height() / 2,
                h = g.$navigator.width() - g.$viewport.width(),
                j = g.$navigator.height() - g.$viewport.height();
            if (l < 0) {
                l = 0
            }
            if (l > h) {
                l = h
            }
            if (k < 0) {
                k = 0
            }
            if (k > j) {
                k = j
            }
            g.$viewport.css({
                left: l,
                top: k
            });
            g.scrolled(g.$viewport.position())
        });
        this.$viewport.draggable({
            containment: "parent",
            start: function(h, i) {
                g.scrolling = true
            },
            drag: function(h, i) {
                if (g.config.liveScroll) {
                    g.scrolled(i.position)
                }
            },
            stop: function(h, i) {
                g.scrolling = false;
                g.scrolled(i.position)
            }
        });
        this.$elem.scroll(function() {
            if (!g.scrolling) {
                g.debug("element scrolling");
                g.update(true)
            } else {
                g.debug("REJECTED scrolling")
            }
        });
        this.$elem.resize(function() {
            if (this.resizeTO) {
                clearTimeout(this.resizeTO)
            }
            this.resizeTO = setTimeout(function() {
                g.debug("element resized...");
                g.update()
            }, 200)
        })
    };

    //get elements to draw
    f.prototype.drawElements = function() {
        this.debug("drawing elements");
        if (this.config.elements) {
            this.elements = this.$relElem.find(this.config.elements)
        } else {
            this.elements = $('#sigma-group-nodes').children().filter(function(){
                return this.getAttributeNS(null, 'display') === 'block'
            })
            // this.hovers = $('#sigma-group-hovers').children()
        }
        if (this.canvasSupported) {
            if (this.config.realistic) {
                this._drawElementsHtml2Canvas(this.$relElem);
                return false
            } else {
                this._drawElementsCanvas()
            }
        } else {
            this._drawElementsDom()
        }
    };
    f.prototype._drawElementsHtml2Canvas = function(h) {
        this.debug("Html2Canvas drawing");
        var g = this;
        this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        this.$navigator.hide();
        this.config.html2canvas.onrendered = function(i) {
            var j = g.$canvas.get(0);
            g.ctx.drawImage(i, 0, 0, i.width, i.height, 0, 0, j.width, j.height);
            g.$navigator.show();
            g.updating = false;
            g.debug("Html2Canvas end drawing")
        };
        b.html2canvas(h, this.config.html2canvas)
    };

    //gets and makes the element properties to render
    f.prototype.getElementProps = function(g) {
        var i = c(g).offset();
        var h = g.getAttributeNS(null, 'fill') ? g.getAttributeNS(null, 'fill') : this.config.defaultBgColor;
        var diameter = 2 * Math.PI * g.getAttributeNS(null, 'r') * this.ratio
        return {
            color: h,
            left: (i.left + this.scrollLeft - this.boardLeft) * this.ratio,
            top: (i.top + this.scrollTop - this.boardTop) * this.ratio,
            // r: g.getAttributeNS(null, 'r') * this.ratio
            width: diameter,
            height: diameter
        }
    };

    //draws onto the canvas
    f.prototype._drawElementsCanvas = function() {
        this.debug("canvas drawing");
        var g = this;
        this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        c(this.elements).each(function() {
            var h = g.getElementProps(this);
            g.ctx.fillStyle = h.color;
            // g.ctx.arc = (h.left, h.top , h.r , 0 , 2 * Math.PI);
            // g.ctx.fill();
            g.ctx.fillRect(h.left, h.top, h.width, h.height)
        })
        // if(c(this.hovers)[0].hasOwnProperty('children')){
        //     var hover = c(this.hovers)[0].children()[0]
        //     var props = g.getElementProps(hover)
        //     g.ctx.fillStyle = '#66c259'
        //     g.ctx.fillRect(props.left, props.top, props.width * 1.25, props.height * 1.25)
        // }
    
    };
    f.prototype._drawElementsDom = function() {
        this.debug("dom drawing");
        var g = this;
        var h = "";
        c(this.elements).each(function() {
            var i = g.getElementProps(this);
            h += '<div style="background-color: ' + i.color + ";left: " + i.left + "px;top: " + i.top + "px;width: " + i.width + "px;height: " + i.height + 'px;"></div>'
        });
        this.$canvasDom.html(h)
    };
    f.prototype.debug = function(g) {
        if (this.config.debug) {
            console.log(g)
        }
    };
    c.fn.boardNav = function(g) {
        return this.each(function() {
            if (g === "update") {
                var h = c(this).data("boardNav-instance");
                if (h) {
                    h.update()
                }
            } else {
                new f(this, g)
            }
        })
    }
})(jQuery, window, document);
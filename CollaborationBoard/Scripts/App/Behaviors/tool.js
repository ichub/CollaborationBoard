var Tool = (function () {
    function Tool(canvas, isRemoteTool) {
        this.canvas = canvas;

        this.$finalCanvas = canvas.$finalCanvas;
        this._finalContext = this.$finalCanvas.get(0).getContext("2d");

        this.$bufferCanvas = this.createBuffer();
        this._bufferContext = this.$bufferCanvas.get(0).getContext("2d");

        this.path = [];

        if (!isRemoteTool) {
            this.addListeners();
        }

        this.isMouseDown = false;
        this.lastMouse = null;

        this.behavior = new DrawBehavior(this);
    }
    Tool.prototype.dispose = function () {
        this.$bufferCanvas.remove();
    };

    Tool.prototype.createBuffer = function () {
        var bufferContainer = $("#bufferContainer");

        var buffer = document.createElement("canvas");

        buffer.classList.add("buffer");

        bufferContainer.append(buffer);

        buffer.width = buffer.clientWidth;
        buffer.height = buffer.clientHeight;

        return $(buffer);
    };

    Tool.prototype.onMouse = function (event) {
        switch (event.type) {
            case 0 /* MouseDown */:
                this.mouseDownWrapper(event, false);
                break;
            case 1 /* MouseDrag */:
                this.mouseMoveWrapper(event, false);
                break;
            case 2 /* MouseUp */:
                this.mouseUpWrapper(event, false);
                break;
        }
    };

    Tool.prototype.finalize = function (path) {
        this.applyStyles(this.finalContext);

        this._behavior.finalize(path);

        this.clearPath();
    };

    Tool.prototype.clearPath = function () {
        this.path = [];
    };

    Tool.prototype.onMouseDown = function (event) {
        this.path.push(event.point);

        this._behavior.onMouseDown(event);
    };

    Tool.prototype.onMouseUp = function (event) {
        this._behavior.onMouseUp(event);

        this._bufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.finalize(this.path);
    };

    Tool.prototype.onMouseDrag = function (event) {
        this._behavior.onMouseDrag(event);
    };

    Tool.prototype.mouseDownWrapper = function (event, sendToServer) {
        if (this.canvas.enabled) {
            this.isMouseDown = true;

            this.lastMouse = new Point(event.point.x, event.point.y);

            var event = new DrawEvent(0 /* MouseDown */, this.lastMouse, this.lastMouse);
            this.onMouseDown(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    };

    Tool.prototype.mouseUpWrapper = function (event, sendToServer) {
        if (this.canvas.enabled && this.isMouseDown) {
            this.isMouseDown = false;

            var event = new DrawEvent(2 /* MouseUp */, new Point(event.point.x, event.point.y), this.lastMouse);

            this.onMouseUp(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    };

    Tool.prototype.mouseMoveWrapper = function (event, sendToServer) {
        if (this.canvas.enabled && this.isMouseDown) {
            var event = new DrawEvent(1 /* MouseDrag */, new Point(event.point.x, event.point.y), this.lastMouse);

            this.path.push(event.point);

            this.onMouseDrag(event);

            this.lastMouse = new Point(event.point.x, event.point.y);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    };

    Tool.prototype.addListeners = function () {
        var _this = this;
        $("#bufferContainer").mousedown(function (e) {
            requestAnimationFrame(function () {
                _this.lastMouse = new Point(e.clientX, e.clientY);

                var event = new DrawEvent(0 /* MouseDown */, new Point(e.clientX, e.clientY), _this.lastMouse);

                _this.mouseDownWrapper(event, true);
            });
        });

        $(document.body).mouseup(function (e) {
            requestAnimationFrame(function () {
                if (_this.canvas.enabled && _this.isMouseDown) {
                    var event = new DrawEvent(2 /* MouseUp */, new Point(e.clientX, e.clientY), _this.lastMouse);

                    _this.mouseUpWrapper(event, true);
                }
            });
        });

        $(document.body).mousemove(function (e) {
            requestAnimationFrame(function () {
                if (_this.canvas.enabled && _this.isMouseDown) {
                    var event = new DrawEvent(1 /* MouseDrag */, new Point(e.clientX, e.clientY), _this.lastMouse);

                    _this.mouseMoveWrapper(event, true);
                }
            });
        });
    };

    Tool.prototype.applyStyles = function (context) {
        for (var style in this._behavior.styles) {
            context[style] = this._behavior.styles[style];
        }
    };

    Object.defineProperty(Tool.prototype, "finalContext", {
        get: function () {
            return this._finalContext;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Tool.prototype, "bufferContext", {
        get: function () {
            return this._bufferContext;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Tool.prototype, "behavior", {
        get: function () {
            return this._behavior;
        },
        set: function (behavior) {
            this._behavior = behavior;

            this.applyStyles(this.finalContext);
            this.applyStyles(this.bufferContext);
        },
        enumerable: true,
        configurable: true
    });

    return Tool;
})();
//# sourceMappingURL=tool.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tool = (function () {
    function Tool(canvas) {
        this.canvas = canvas;

        this.$finalCanvas = canvas.$finalCanvas;
        this.finalContext = this.$finalCanvas.get(0).getContext("2d");

        this.$bufferCanvas = this.createBuffer();
        this.bufferContext = this.$bufferCanvas.get(0).getContext("2d");

        this.path = [];

        this.isMouseDown = false;
        this.lastMouse = null;

        this.behavior = new DrawBehavior(this);

        this.setBehavior(new DrawBehavior(this));
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
        this.setToolFromName(event.toolBehaviorName);

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

    Tool.prototype.setToolFromName = function (toolBehaviorName) {
        switch (toolBehaviorName) {
            case "erase":
                this.setBehavior(new EraseBehavior(this));
                break;
            case "draw":
                this.setBehavior(new DrawBehavior(this));
                break;
        }
    };

    Tool.prototype.finalize = function (path) {
        this.applyStyles(this.finalContext);

        this.behavior.finalize(path);

        this.clearPath();
    };

    Tool.prototype.clearPath = function () {
        this.path = [];
    };

    Tool.prototype.onMouseDown = function (event) {
        this.path.push(event.point);

        this.behavior.onMouseDown(event);
    };

    Tool.prototype.onMouseUp = function (event) {
        this.behavior.onMouseUp(event);

        this.bufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.finalize(this.path);
    };

    Tool.prototype.onMouseDrag = function (event) {
        this.behavior.onMouseDrag(event);
    };

    Tool.prototype.mouseDownWrapper = function (event, sendToServer) {
        if (this.canvas.enabled) {
            this.isMouseDown = true;

            this.lastMouse = new Point(event.point.x, event.point.y);

            var event = new DrawEvent(0 /* MouseDown */, this.lastMouse, this.lastMouse, event.toolBehaviorName);
            this.onMouseDown(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    };

    Tool.prototype.mouseUpWrapper = function (event, sendToServer) {
        if (this.canvas.enabled && this.isMouseDown) {
            this.isMouseDown = false;

            var event = new DrawEvent(2 /* MouseUp */, new Point(event.point.x, event.point.y), this.lastMouse, event.toolBehaviorName);

            this.onMouseUp(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    };

    Tool.prototype.mouseMoveWrapper = function (event, sendToServer) {
        if (this.canvas.enabled && this.isMouseDown) {
            var event = new DrawEvent(1 /* MouseDrag */, new Point(event.point.x, event.point.y), this.lastMouse, event.toolBehaviorName);

            this.path.push(event.point);

            this.onMouseDrag(event);

            this.lastMouse = new Point(event.point.x, event.point.y);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    };

    Tool.prototype.applyStyles = function (context) {
        for (var style in this.behavior.styles) {
            context[style] = this.behavior.styles[style];
        }
    };

    Tool.prototype.setBehavior = function (behavior) {
        this.behavior = behavior;

        this.applyStyles(this.finalContext);
        this.applyStyles(this.bufferContext);
    };
    return Tool;
})();

var LocalTool = (function (_super) {
    __extends(LocalTool, _super);
    function LocalTool(canvas) {
        _super.call(this, canvas);

        this.addListeners();
    }
    LocalTool.prototype.addListeners = function () {
        var _this = this;
        $("#bufferContainer").mousedown(function (e) {
            requestAnimationFrame(function () {
                _this.lastMouse = new Point(e.clientX, e.clientY);

                var event = new DrawEvent(0 /* MouseDown */, new Point(e.clientX, e.clientY), _this.lastMouse, _this.behavior.name);

                _this.mouseDownWrapper(event, true);
            });
        });

        $(document.body).mouseup(function (e) {
            requestAnimationFrame(function () {
                if (_this.canvas.enabled && _this.isMouseDown) {
                    var event = new DrawEvent(2 /* MouseUp */, new Point(e.clientX, e.clientY), _this.lastMouse, _this.behavior.name);

                    _this.mouseUpWrapper(event, true);
                }
            });
        });

        $(document.body).mousemove(function (e) {
            requestAnimationFrame(function () {
                if (_this.canvas.enabled && _this.isMouseDown) {
                    var event = new DrawEvent(1 /* MouseDrag */, new Point(e.clientX, e.clientY), _this.lastMouse, _this.behavior.name);

                    _this.mouseMoveWrapper(event, true);
                }
            });
        });
    };
    return LocalTool;
})(Tool);
//# sourceMappingURL=tool.js.map

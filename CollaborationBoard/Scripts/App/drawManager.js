(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var drawManager = function (canvas) {
        this.canvas = canvas;
        this.jCanvas = $(canvas);


        this.ctx = canvas.getContext("2d");

        this.width = 1600;
        this.height = 900;
        
        this.jCanvas.css({
            width: this.width,
            height: this.height
        });

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.state = {
            drag: {
                enabled: true,
                x: 0, // coordinates when dragging starts
                y: 0,
                mouseX: 0,
                mouseY: 0,
            }
        };

        this.mouse = {
            x: 0,
            y: 0,
            px: 0,
            py: 0,
            down: false,
            initialized: false
        };

        var that = this;

        this.jCanvas.mousedown(function (e) {
            that.updateMouseDown(e);
            if (that.state.drag.enabled) {
                that.onDragStart(e);
            }
            else {
                that.onDrawStart(e);
            }
        });

        this.jCanvas.mouseup(function (e) {
            that.updateMouseUp(e);
            if (that.state.drag.enabled) {
                that.onDragEnd(e);
            }
            else {
                that.onDrawEnd(e);
            }
        });

        this.jCanvas.mousemove(function (e) {
            that.updateMousePosition(e);
            if (that.mouse.down) {
                if (that.state.drag.enabled) {
                    that.onDrag(e);
                }
                else {
                    that.onDraw(e);
                }
            }
        });

        this.resetDrawingSettings();
        this.jCanvas.center();
    };

    drawManager.prototype.resetDrawingSettings = function () {
        this.ctx.strokeStyle = "#000";
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 3;
    };

    drawManager.prototype.drawLine = function (x1, y1, x2, y2) {
        var coords = this.jCanvas.position();

        this.ctx.beginPath();
        this.ctx.moveTo(x1 - coords.left, y1 - coords.top);
        this.ctx.lineTo(x2 - coords.left, y2 - coords.top);
        this.ctx.stroke();
    };

    drawManager.prototype.updateMouseDown = function (e) {
        var ms = this.mouse;

        if (e.button == 0) {
            ms.down = true;
        }
    };

    drawManager.prototype.updateMouseUp = function (e) {
        var ms = this.mouse;

        if (e.button == 0) {
            ms.down = false;
        }
    };

    drawManager.prototype.updateMousePosition = function (e) {
        var ms = this.mouse;

        if (!ms.initialized || !ms.down) {
            ms.initialized = true;

            ms.x = e.clientX;
            ms.y = e.clientY;
            ms.px = ms.x;
            ms.py = ms.y;
        }
        else {
            ms.px = ms.x;
            ms.py = ms.y;
            ms.x = e.clientX;
            ms.y = e.clientY;
        }
    };

    drawManager.prototype.onDrag = function (e) {
        var canvas = this.jCanvas;

        var ms = this.mouse;
        var drag = this.state.drag;

        var newX = ms.x - drag.mouseX + drag.x;
        var newY = ms.y - drag.mouseY + drag.y;

        canvas.offset({
            top: newY,
            left: newX
        })
    };

    drawManager.prototype.onDragStart = function (e) {
        var canvas = this.jCanvas;

        var drag = this.state.drag;
        var ms = this.mouse;
        var coords = canvas.position();

        drag.x = coords.left;
        drag.y = coords.top;
        drag.mouseX = ms.x;
        drag.mouseY = ms.y;
    };

    drawManager.prototype.onDragEnd = function (e) {
        this.state.drag.enabled = false;
    };

    drawManager.prototype.onDrawStart = function (e) {
        var ms = this.mouse;

    };

    drawManager.prototype.onDrawEnd = function (e) {
        var ms = this.mouse;

    };

    drawManager.prototype.onDraw = function (e) {
        var ms = this.mouse;

        this.drawLine(ms.x, ms.y, ms.px, ms.py);
    };

    Collab.DrawManager = drawManager;
})();
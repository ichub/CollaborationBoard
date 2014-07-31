(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var drawManager = function (canvas) {
        this.canvas = canvas;
        this.jCanvas = $(canvas);
        this.board = $.connection.boardHub;
        this.parent = this.jCanvas.parent();

        this.ctx = canvas.getContext("2d");

        this.width = 800;
        this.height = 600;

        this.jCanvas.css({
            width: this.width,
            height: this.height
        });

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.state = {
            drag: {
                enabled: false,
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

        this.parent.mouseup(function (e) {
            that.updateMouseUp(e);
            if (that.state.drag.enabled) {
                that.onDragEnd(e);
            }
            else {
                that.onDrawEnd(e);
            }
        });

        this.parent.mousemove(function (e) {
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

        $(window).resize(function (e) {
            that.jCanvas.center();
        });

        this.resetDrawingSettings();
        this.jCanvas.center();
        this.initializeConnection();
    };

    drawManager.prototype.initializeConnection = function () {
        var that = this;

        this.board.client.draw = function (cid, x1, y1, x2, y2) {
            if (cid != $.connection.hub.id) {
                that.drawLine(x1, y1, x2, y2);
            }
        };

        $.connection.hub.start().done(function () {
        });
    };

    drawManager.prototype.sendServerDraw = function (x1, y1, x2, y2) {
        this.board.server.draw(x1, y1, x2, y2);
    };

    drawManager.prototype.resetDrawingSettings = function () {
        this.ctx.strokeStyle = "#000";
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 2;
    };

    drawManager.prototype.drawLine = function (x1, y1, x2, y2) {
        var coords = this.jCanvas.position();

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    };

    drawManager.prototype.drawLinePoints = function (points) {
        this.ctx.beginPath();

        for (var i = 0; i < points.length - 1; i++) {
            this.ctx.moveTo(points[i].X, points[i].Y);
            this.ctx.lineTo(points[i + 1].X, points[i + 1].Y);
        }

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
        var coords = this.jCanvas.position();

        if (!ms.initialized || !ms.down) {
            ms.initialized = true;

            ms.x = e.clientX - coords.left;
            ms.y = e.clientY - coords.top;
            ms.px = ms.x;
            ms.py = ms.y;
        }
        else {
            ms.px = ms.x;
            ms.py = ms.y;
            ms.x = e.clientX - coords.left;
            ms.y = e.clientY - coords.top;
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
    };

    drawManager.prototype.onDrawEnd = function (e) {
    };

    drawManager.prototype.onDraw = function (e) {
        var ms = this.mouse;

        this.drawLine(ms.x, ms.y, ms.px, ms.py);
        this.sendServerDraw(ms.x, ms.y, ms.px, ms.py);
    };

    Collab.DrawManager = drawManager;
})();
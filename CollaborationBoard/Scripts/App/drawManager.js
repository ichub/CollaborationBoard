(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var drawManager = function (canvas) {
        this.canvas = canvas;
        this.jCanvas = $(canvas);
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
            },
            sync: {
                lines: [],
                lastLine: null,
                prevSyncLast: null
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
    };

    drawManager.prototype.resetDrawingSettings = function () {
        this.ctx.strokeStyle = "#000";
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 10;
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
        var lastLine = new Collab.Line([]);
        this.state.sync.lastLine = lastLine;

        this.state.sync.lastLine.Points.push(new Collab.Point(this.mouse.x, this.mouse.y));
    };

    drawManager.prototype.onDrawEnd = function (e) {
        this.state.sync.lastLine.Points.push(new Collab.Point(this.mouse.x, this.mouse.y));
        this.state.sync.lines.push(this.state.sync.lastLine);
        this.state.sync.lastLine = null;
    };

    drawManager.prototype.onDraw = function (e) {
        var ms = this.mouse;

        this.state.sync.lastLine.Points.push(new Collab.Point(this.mouse.x, this.mouse.y));
        this.drawLine(ms.x, ms.y, ms.px, ms.py);
    };

    drawManager.prototype.flushPending = function () {
        var lines = this.state.sync.lines;
        var last = this.state.sync.lastLine;

        if (last != null) {
            lines.push(last);
        }

        this.state.sync.lines = [];

        return lines;
    };

    drawManager.prototype.onSync = function (actionGroups) {
        for (var i = 0; i < actionGroups.length; i++) {
            this.updateLines(actionGroups[i]);
        }
    };

    drawManager.prototype.updateLines = function (actionGroup) {
        var lines = actionGroup.Lines;

        for (var i = 0; i < lines.length; i++) {
            this.drawLinePoints(lines[i].Points);
        }
    };

    Collab.DrawManager = drawManager;
})();
(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var drawManager = function (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.mouse = {
            x: 0,
            y: 0,
            px: 0,
            py: 0,
            down: false,
            initialized: false
        };

        var that = this;

        $(canvas).mousedown(function (e) {
            that.updateMouseDown(e);
            that.onMouseDown(e);
        });

        $(canvas).mouseup(function (e) {
            that.updateMouseUp(e);
            that.onMouseUp(e);
        });

        $(canvas).mousemove(function (e) {
            that.updateMousePosition(e);
            that.onDrag(e);
        });

        $(window).resize(function (e) {
            var data = that.getData();

            that.canvas.width = that.canvas.parentElement.clientWidth;
            that.canvas.height = that.canvas.parentElement.clientHeight;

            that.setData(data);
            that.resetDrawingSettings();
        });

        this.resetDrawingSettings();
    };

    drawManager.prototype.getData = function () {
        return this.ctx.getImageData(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    };

    drawManager.prototype.setData = function (data) {
        this.ctx.putImageData(data, 0, 0);
    };

    drawManager.prototype.resetDrawingSettings = function () {
        this.ctx.strokeStyle = "#000";
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 3;
    };

    drawManager.prototype.drawLine = function (x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
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

    drawManager.prototype.onMouseDown = function (e) {
        var ms = this.mouse;

    };

    drawManager.prototype.onMouseUp = function (e) {
        var ms = this.mouse;

    };

    drawManager.prototype.onDrag = function (e) {
        var ms = this.mouse;

        this.drawLine(ms.x, ms.y, ms.px, ms.py);
    };

    Collab.DrawManager = drawManager;
})();
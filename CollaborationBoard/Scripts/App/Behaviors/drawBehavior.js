var DrawBehavior = (function () {
    function DrawBehavior(tool) {
        this.styles = {
            "lineCap": "round",
            "lineJoin": "round",
            "strokeStyle": "#000000",
            "lineWidth": 20
        };
        this.bufferContext = tool.bufferContext;
        this.finalContext = tool.finalContext;
    }
    DrawBehavior.prototype.onMouseDrag = function (event) {
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(event.point.x, event.point.y);
        this.bufferContext.lineTo(event.lastPoint.x, event.lastPoint.y);
        this.bufferContext.stroke();
        this.bufferContext.closePath();
    };

    DrawBehavior.prototype.onMouseDown = function (event) {
    };

    DrawBehavior.prototype.onMouseUp = function (event) {
    };

    DrawBehavior.prototype.finalize = function (path) {
        this.finalContext.beginPath();

        for (var i = 0; i < path.length - 1; i++) {
            this.finalContext.moveTo(path[i].x, path[i].y);
            this.finalContext.lineTo(path[i + 1].x, path[i + 1].y);
        }
        this.finalContext.stroke();
        this.finalContext.closePath();
    };
    return DrawBehavior;
})();
//# sourceMappingURL=drawBehavior.js.map

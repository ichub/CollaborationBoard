var EraseBehavior = (function () {
    function EraseBehavior(tool) {
        this.name = "erase";
        this.styles = {
            "lineCap": "round",
            "lineJoin": "round",
            "strokeStyle": "#ffffff",
            "lineWidth": 20
        };
        this.bufferContext = tool.bufferContext;
        this.finalContext = tool.finalContext;
    }
    EraseBehavior.prototype.onMouseDrag = function (event) {
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(event.point.x, event.point.y);
        this.bufferContext.lineTo(event.lastPoint.x, event.lastPoint.y);
        this.bufferContext.stroke();
        this.bufferContext.closePath();
    };

    EraseBehavior.prototype.onMouseDown = function (event) {
    };

    EraseBehavior.prototype.onMouseUp = function (event) {
    };

    EraseBehavior.prototype.finalize = function (path) {
        this.finalContext.beginPath();

        for (var i = 0; i < path.length - 1; i++) {
            this.finalContext.moveTo(path[i].x, path[i].y);
            this.finalContext.lineTo(path[i + 1].x, path[i + 1].y);
        }
        this.finalContext.stroke();
        this.finalContext.closePath();
    };
    return EraseBehavior;
})();
//# sourceMappingURL=eraseBehavior.js.map

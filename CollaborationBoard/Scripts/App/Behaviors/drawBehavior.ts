class DrawBehavior implements ToolBehavior {
    styles = {
        "lineCap": "round",
        "lineJoin": "round",
        "strokeStyle": "#000000",
        "fillStyle": "#000000",
        "lineWidth": 2
    };

    public bufferContext: CanvasRenderingContext2D;
    public finalContext: CanvasRenderingContext2D;

    constructor(tool: Tool) {
        this.bufferContext = tool.bufferContext;
        this.finalContext = tool.finalContext;
    }

    public onMouseDrag(event: DrawEvent) {
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(event.point.x, event.point.y);
        this.bufferContext.lineTo(event.lastPoint.x, event.lastPoint.y);
        this.bufferContext.stroke();
        this.bufferContext.closePath();
    }

    public onMouseDown(event: DrawEvent) {
        this.bufferContext.beginPath();
        this.bufferContext.arc(event.point.x, event.point.y, this.styles.lineWidth / 2, 0, 2 * Math.PI, false);
        this.bufferContext.fill();
    }

    public onMouseUp(event: DrawEvent) {
    }

    public finalize(path: Array<Point>) {
        this.finalContext.beginPath();

        this.finalContext.arc(path[0].x, path[0].y, this.styles.lineWidth / 2, 0, 2 * Math.PI, false);
        this.finalContext.fill();

        this.finalContext.closePath();

        this.finalContext.beginPath();

        for (var i = 0; i < path.length - 1; i++) {
            this.finalContext.moveTo(path[i].x, path[i].y);
            this.finalContext.lineTo(path[i + 1].x, path[i + 1].y);
        }

        this.finalContext.stroke();
        this.finalContext.closePath();
    }
}
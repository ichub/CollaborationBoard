class DrawBehavior implements ToolBehavior {
    public bufferContext: CanvasRenderingContext2D;
    public finalContext: CanvasRenderingContext2D;

    constructor(bufferContext: CanvasRenderingContext2D, finalContext: CanvasRenderingContext2D) {
        this.bufferContext = bufferContext;
        this.finalContext = finalContext;

        this.bufferContext.lineCap = "round";
        this.bufferContext.lineJoin = "round";
        this.bufferContext.lineWidth = 2;

        this.finalContext.lineCap = "round";
        this.finalContext.lineJoin = "round";
        this.finalContext.lineWidth = 2;
    }

    public onMouseDrag(event: DrawEvent) {
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(event.point.x, event.point.y);
        this.bufferContext.lineTo(event.lastPoint.x, event.lastPoint.y);
        this.bufferContext.stroke();
        this.bufferContext.closePath();
    }

    public onMouseDown(event: DrawEvent) {
    }

    public onMouseUp(event: DrawEvent) {
    }

    public finalize(path: Array<Point>) {
        this.finalContext.beginPath();

        for (var i = 0; i < path.length - 1; i++) {
            this.finalContext.moveTo(path[i].x, path[i].y);
            this.finalContext.lineTo(path[i + 1].x, path[i + 1].y);
        }
        this.finalContext.stroke();
        this.finalContext.closePath();
    }
}
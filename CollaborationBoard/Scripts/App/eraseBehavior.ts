class EraseBehavior implements ToolBehavior {
    public bufferContext: CanvasRenderingContext2D;
    public finalContext: CanvasRenderingContext2D;

    constructor(tool: Tool) {
        this.bufferContext = tool.bufferContext;
        this.finalContext = tool.finalContext;

        this.bufferContext.lineCap = "round";
        this.bufferContext.lineJoin = "round";
        this.bufferContext.strokeStyle = "#ffffff";
        this.bufferContext.lineWidth = 20;
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

    public setStyle() {
        this.finalContext.strokeStyle = "#ffffff";
        this.finalContext.lineCap = "round";
        this.finalContext.lineJoin = "round";
        this.finalContext.lineWidth = 20;
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
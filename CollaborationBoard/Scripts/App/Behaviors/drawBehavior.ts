class DrawBehavior implements ToolBehavior {
    public name = "draw";
    public color = "black";
    public thickness = 5;

    styles = {
        "lineCap": "round",
        "lineJoin": "round",
        "lineWidth": 2
    };

    public bufferContext: CanvasRenderingContext2D;
    public finalContext: CanvasRenderingContext2D;

    constructor(tool: Tool) {
        this.bufferContext = tool.bufferContext;
        this.finalContext = tool.finalContext;

        this.color = tool.canvas.toolBox.currentColor;
    }

    public onMouseDrag(event: DrawEvent): void {
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(event.point.x, event.point.y);
        this.bufferContext.lineTo(event.lastPoint.x, event.lastPoint.y);
        this.bufferContext.stroke();
        this.bufferContext.closePath();
    }

    public onMouseDown(event: DrawEvent): void {
        this.bufferContext.beginPath();
        this.bufferContext.arc(event.point.x, event.point.y, this.thickness / 2, 0, 2 * Math.PI, false);
        this.bufferContext.fill();
    }

    public onMouseUp(event: DrawEvent): void {
    }

    public finalize(path: Array<Point>): void {
        this.finalContext.beginPath();

        this.finalContext.arc(path[0].x, path[0].y, this.thickness / 2, 0, 2 * Math.PI, false);
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
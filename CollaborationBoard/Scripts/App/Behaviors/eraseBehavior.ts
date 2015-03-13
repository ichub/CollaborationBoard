class EraseBehavior implements ToolBehavior {
    public name = "erase";
    public color = "white";
    public thickness = 5;

    styles = {
        "lineCap": "round",
        "lineJoin": "round",
        "lineWidth": 20
    };

    public bufferContext: CanvasRenderingContext2D;
    public finalContext: CanvasRenderingContext2D;

    constructor(tool: Tool) {
        this.bufferContext = tool.bufferContext;
        this.finalContext = tool.finalContext;
    }

    public onMouseDrag(event: DrawEvent): void {
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(event.point.x, event.point.y);
        this.bufferContext.lineTo(event.lastPoint.x, event.lastPoint.y);
        this.bufferContext.stroke();
        this.bufferContext.closePath();
    }

    public onMouseDown(event: DrawEvent): void {
    }

    public onMouseUp(event: DrawEvent): void {
    }

    public finalize(path: Array<Point>): void {
        this.finalContext.beginPath();

        for (var i = 0; i < path.length - 1; i++) {
            this.finalContext.moveTo(path[i].x, path[i].y);
            this.finalContext.lineTo(path[i + 1].x, path[i + 1].y);
        }
        this.finalContext.stroke();
        this.finalContext.closePath();
    }
} 
class DrawTool {
    private canvas: Canvas;
    private $canvas: JQuery;
    private $finalCanvas: JQuery;
    private context: CanvasRenderingContext2D;
    private finalContext: CanvasRenderingContext2D;
    private isMouseDown: boolean;
    private lastMouse: Point;
    private path: Array<Point>;

    public constructor(canvas: Canvas) {
        this.$canvas = canvas.$canvas;
        this.$finalCanvas = canvas.$finalCanvas;
        this.canvas = canvas;
        this.context = (<HTMLCanvasElement> this.$canvas.get(0)).getContext("2d");
        this.finalContext = (<HTMLCanvasElement> this.$finalCanvas.get(0)).getContext("2d");
        this.path = [];

        this.addListeners();
        this.isMouseDown = false;
        this.lastMouse = null;

        this.initializeStyle();
    }

    public onMouse(event: DrawEvent): void {
        switch (event.type) {
            case DrawEventType.MouseDown:
                this.onMouseDown(event);
                break;
            case DrawEventType.MouseDrag:
                this.onMouseDrag(event);
                break;
            case DrawEventType.MouseUp:
                this.onMouseUp(event);
                break;
        }
    }

    private onMouseDragDraw(xCoords: Array<number>, yCoords: Array<number>): void {
        var x = new Array(xCoords.length + 2);
        var y = new Array(yCoords.length + 2);
        x[0] = xCoords[0];
        y[0] = yCoords[0];
        x[1] = xCoords[0];
        y[1] = yCoords[0];
        for (var i = 1; i < xCoords.length + 1; i++) {
            x[i] = xCoords[i - 1];
            y[i] = yCoords[i - 1];
        }
        x[xCoords.length + 1] = xCoords[xCoords.length - 1];
        y[yCoords.length + 1] = yCoords[yCoords.length - 1];
        for (var i = 1; i < x.length; i++) {
            this.context.beginPath();
            this.context.moveTo(x[i], y[i]);
            var controlPointX1 = (x[i] + x[i + 1] - x[i - 1]) / 4;
            var controlPointY1 = (y[i] + y[i + 1] - y[i - 1]) / 4;
            var controlPointX2 = (x[i + 1] + x[i] - x[i + 2]) / 4;
            var controlPointY2 = (y[i + 1] + y[i] - y[i + 2]) / 4;
            this.context.bezierCurveTo(controlPointX1, controlPointY1, controlPointX2, controlPointY2, x[i + 1], y[i + 1]);
            this.context.stroke();
            this.context.closePath();
        }
    }

    private drawSmoothPath(path: Array<Point>): void {
        for (var i = 0; i < path.length; i++) {
            this.context.fillRect(path[i].x, path[i].y, 5, 5);
        }
    }

    private initializeStyle(): void {
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 5;

        this.finalContext.lineCap = "round";
        this.finalContext.lineJoin = "round";
        this.finalContext.lineWidth = 5;
    }

    private onMouseDown(event: DrawEvent): void {
    }

    private onMouseUp(event: DrawEvent): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawSmoothPath(this.path);
    }

    private onMouseDrag(event: DrawEvent): void {
        requestAnimationFrame(() => { // this call is required for any drawing on canvas, otherwise aliasing bugs happen
            this.context.beginPath();
            this.context.moveTo(event.point.x, event.point.y);
            this.context.lineTo(event.lastPoint.x, event.lastPoint.y);
            this.context.stroke();
            this.context.closePath();
        });
    }

    private addListeners(): void {
        this.$canvas.mousedown(e => {
            if (this.canvas.enabled) {
                this.isMouseDown = true;

                this.lastMouse = new Point(e.clientX, e.clientY);

                var event = new DrawEvent(DrawEventType.MouseDown, new Point(e.clientX, e.clientY), this.lastMouse);
                this.onMouseDown(event);

                this.canvas.sendDrawEvent(event);
            }
        });

        $(document.body).mouseup(e => {
            if (this.canvas.enabled && this.isMouseDown) {
                this.isMouseDown = false;

                var event = new DrawEvent(DrawEventType.MouseUp, new Point(e.clientX, e.clientY), this.lastMouse);
                this.onMouseUp(event);

                this.canvas.sendDrawEvent(event);

                this.path = [];
            }
        });

        $(document.body).mousemove(e => {
            if (this.canvas.enabled) {
                if (this.isMouseDown) {
                    var event = new DrawEvent(DrawEventType.MouseDrag, new Point(e.clientX, e.clientY), this.lastMouse);

                    this.path.push(event.point);

                    this.onMouseDrag(event);

                    this.lastMouse = new Point(e.clientX, e.clientY);

                    this.canvas.sendDrawEvent(event);
                }
            }
        });
    }
} 
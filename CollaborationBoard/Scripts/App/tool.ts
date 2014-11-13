class Tool {
    private canvas: Canvas;
    private $bufferCanvas: JQuery;
    private $finalCanvas: JQuery;
    private _bufferContext: CanvasRenderingContext2D;
    private _finalContext: CanvasRenderingContext2D;
    private isMouseDown: boolean;
    private lastMouse: Point;
    private path: Array<Point>;

    public currentBehavior: ToolBehavior;

    public constructor(canvas: Canvas) {
        this.canvas = canvas;

        this.$finalCanvas = canvas.$finalCanvas;
        this._finalContext = (<HTMLCanvasElement> this.$finalCanvas.get(0)).getContext("2d");

        this.$bufferCanvas = this.createBuffer();
        this._bufferContext = (<HTMLCanvasElement> this.$bufferCanvas.get(0)).getContext("2d");

        this.path = [];

        this.addListeners();
        this.isMouseDown = false;
        this.lastMouse = null;
        this.currentBehavior = new DrawBehavior(this);
    }

    public dispose() {
        this.$bufferCanvas.remove();
    }

    private createBuffer(): JQuery {
        var bufferContainer = $("#bufferContainer");

        var buffer = document.createElement("canvas");

        buffer.classList.add("buffer");

        bufferContainer.append(buffer);

        buffer.width = buffer.clientWidth;
        buffer.height = buffer.clientHeight;

        return $(buffer);
    }

    public onMouse(event: DrawEvent): void {
        switch (event.type) {
            case DrawEventType.MouseDown:
                this.mouseDownWrapper(event, false);
                break;
            case DrawEventType.MouseDrag:
                this.mouseMoveWrapper(event, false);
                break;
            case DrawEventType.MouseUp:
                this.mouseUpWrapper(event, false);
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
            this._bufferContext.beginPath();
            this._bufferContext.moveTo(x[i], y[i]);
            var controlPointX1 = (x[i] + x[i + 1] - x[i - 1]) / 4;
            var controlPointY1 = (y[i] + y[i + 1] - y[i - 1]) / 4;
            var controlPointX2 = (x[i + 1] + x[i] - x[i + 2]) / 4;
            var controlPointY2 = (y[i + 1] + y[i] - y[i + 2]) / 4;
            this._bufferContext.bezierCurveTo(controlPointX1, controlPointY1, controlPointX2, controlPointY2, x[i + 1], y[i + 1]);
            this._bufferContext.stroke();
            this._bufferContext.closePath();
        }
    }

    private finalize(path: Array<Point>): void {
        this.currentBehavior.setStyle();
        this.currentBehavior.finalize(path);

        this.clearPath();
    }

    private clearPath(): void {
        this.path = [];
    }

    private onMouseDown(event: DrawEvent): void {
        this.path.push(event.point);

        this.currentBehavior.onMouseDown(event);
    }

    private onMouseUp(event: DrawEvent): void {
        this.currentBehavior.onMouseUp(event);

        this._bufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.finalize(this.path);
    }

    private onMouseDrag(event: DrawEvent): void {
        this.currentBehavior.onMouseDrag(event);
    }

    private mouseDownWrapper(event: DrawEvent, sendToServer: boolean) {
        if (this.canvas.enabled) {
            this.isMouseDown = true;

            this.lastMouse = new Point(event.point.x, event.point.y);

            var event = new DrawEvent(DrawEventType.MouseDown, this.lastMouse, this.lastMouse);
            this.onMouseDown(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    private mouseUpWrapper(event: DrawEvent, sendToServer: boolean) {
        if (this.canvas.enabled && this.isMouseDown) {
            this.isMouseDown = false;

            var event = new DrawEvent(DrawEventType.MouseUp, new Point(event.point.x, event.point.y), this.lastMouse);

            this.onMouseUp(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    private mouseMoveWrapper(event: DrawEvent, sendToServer: boolean) {
        if (this.canvas.enabled && this.isMouseDown) {
            var event = new DrawEvent(DrawEventType.MouseDrag, new Point(event.point.x, event.point.y), this.lastMouse);

            this.path.push(event.point);

            this.onMouseDrag(event);

            this.lastMouse = new Point(event.point.x, event.point.y);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    private addListeners(): void {
        $("#bufferContainer").mousedown(e => {
            requestAnimationFrame(() => {
                this.lastMouse = new Point(e.clientX, e.clientY);

                var event = new DrawEvent(DrawEventType.MouseDown, new Point(e.clientX, e.clientY), this.lastMouse);

                this.mouseDownWrapper(event, true);
            });
        });

        $(document.body).mouseup(e => {
            requestAnimationFrame(() => {
                if (this.canvas.enabled && this.isMouseDown) {
                    var event = new DrawEvent(DrawEventType.MouseUp, new Point(e.clientX, e.clientY), this.lastMouse);

                    this.mouseUpWrapper(event, true);
                }
            });
        });

        $(document.body).mousemove(e => {
            requestAnimationFrame(() => {
                if (this.canvas.enabled && this.isMouseDown) {
                    var event = new DrawEvent(DrawEventType.MouseDrag, new Point(e.clientX, e.clientY), this.lastMouse);

                    this.mouseMoveWrapper(event, true);
                }
            });
        });
    }

    public get finalContext(): CanvasRenderingContext2D {
        return this._finalContext;
    }

    public get bufferContext(): CanvasRenderingContext2D {
        return this._bufferContext;
    }
} 
class Tool {
    private canvas: Canvas;
    private $bufferCanvas: JQuery;
    private $finalCanvas: JQuery;
    private _bufferContext: CanvasRenderingContext2D;
    private _finalContext: CanvasRenderingContext2D;
    private isMouseDown: boolean;
    private lastMouse: Point;
    private path: Array<Point>;

    private _behavior: ToolBehavior;

    public constructor(canvas: Canvas, isRemoteTool: boolean) {
        this.canvas = canvas;

        this.$finalCanvas = canvas.$finalCanvas;
        this._finalContext = (<HTMLCanvasElement> this.$finalCanvas.get(0)).getContext("2d");

        this.$bufferCanvas = this.createBuffer();
        this._bufferContext = (<HTMLCanvasElement> this.$bufferCanvas.get(0)).getContext("2d");

        this.path = [];

        if (!isRemoteTool) {
            this.addListeners();
        }

        this.isMouseDown = false;
        this.lastMouse = null;

        this.behavior = new DrawBehavior(this);
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

    private finalize(path: Array<Point>): void {
        this.applyStyles(this.finalContext);

        this._behavior.finalize(path);

        this.clearPath();
    }

    private clearPath(): void {
        this.path = [];
    }

    private onMouseDown(event: DrawEvent): void {
        this.path.push(event.point);

        this._behavior.onMouseDown(event);
    }

    private onMouseUp(event: DrawEvent): void {

        this._behavior.onMouseUp(event);

        this._bufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.finalize(this.path);
    }

    private onMouseDrag(event: DrawEvent): void {
        this._behavior.onMouseDrag(event);
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

    private applyStyles(context: CanvasRenderingContext2D) {
        for (var style in this._behavior.styles) {
            context[style] = this._behavior.styles[style];
        }
    }

    public get finalContext(): CanvasRenderingContext2D {
        return this._finalContext;
    }

    public get bufferContext(): CanvasRenderingContext2D {
        return this._bufferContext;
    }

    public get behavior(): ToolBehavior {
        return this._behavior;
    }

    public set behavior(behavior: ToolBehavior) {
        this._behavior = behavior;

        this.applyStyles(this.finalContext);
        this.applyStyles(this.bufferContext);
    }
} 
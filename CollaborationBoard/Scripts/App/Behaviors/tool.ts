class Tool {
    public userId: string;
    public canvas: Canvas;
    public $bufferCanvas: JQuery;
    public $finalCanvas: JQuery;
    public bufferContext: CanvasRenderingContext2D;
    public finalContext: CanvasRenderingContext2D;

    public isMouseDown: boolean = false;
    public lastMouse: Point = null;
    public path: Array<Point> = [];

    public behavior: ToolBehavior;

    public constructor(userId: string, canvas: Canvas) {
        this.userId = userId;
        this.canvas = canvas;

        this.$finalCanvas = canvas.$finalCanvas;
        this.finalContext = (<HTMLCanvasElement> this.$finalCanvas.get(0)).getContext("2d");

        this.$bufferCanvas = this.createBuffer();
        this.bufferContext = (<HTMLCanvasElement> this.$bufferCanvas.get(0)).getContext("2d");

        this.setBehavior(new DrawBehavior(this));
    }

    public dispose(): void {
        this.$bufferCanvas.remove();
    }

    public createBuffer(): JQuery {
        var bufferContainer = $("#bufferContainer");

        var buffer = document.createElement("canvas");

        buffer.classList.add("buffer");

        bufferContainer.append(buffer);

        buffer.width = buffer.clientWidth;
        buffer.height = buffer.clientHeight;

        return $(buffer);
    }

    public onMouse(event: DrawEvent): void {
        this.setToolFromSnapshot(event.toolBehaviorName, event.color);

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

    public setToolFromSnapshot(toolBehaviorName: string, color: string): void {
        if (toolBehaviorName != this.behavior.name) {
            if (this.userId == this.canvas.app.user.id) {
                this.canvas.toolBox.setTool(toolBehaviorName, false);
            }
            else {
                switch (toolBehaviorName) {
                    case "erase":
                        this.setBehavior(new EraseBehavior(this));
                        break;
                    case "draw":
                        this.setBehavior(new DrawBehavior(this));
                        break;
                }
            }
        }

        this.behavior.color = color;
        this.applyStyles(this.bufferContext);
    }

    public finalize(path: Array<Point>): void {
        this.applyStyles(this.finalContext);

        this.behavior.finalize(path);

        this.clearPath();
    }

    public clearPath(): void {
        this.path = [];
    }

    public onMouseDown(event: DrawEvent): void {
        this.path.push(event.point);

        this.behavior.onMouseDown(event);
    }

    public onMouseUp(event: DrawEvent): void {
        this.behavior.onMouseUp(event);

        this.bufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.finalize(this.path);
    }

    public onMouseDrag(event: DrawEvent): void {
        this.behavior.onMouseDrag(event);
    }

    public mouseDownWrapper(event: DrawEvent, sendToServer: boolean): void {
        this.isMouseDown = true;

        this.lastMouse = new Point(event.point.x, event.point.y);

        var event = this.createEvent(DrawEventType.MouseDown, this.lastMouse, this.lastMouse);
        this.onMouseDown(event);

        if (sendToServer) {
            this.canvas.sendDrawEvent(event);
        }
    }

    public mouseUpWrapper(event: DrawEvent, sendToServer: boolean): void {
        if (this.isMouseDown) {
            this.isMouseDown = false;

            var event = this.createEvent(DrawEventType.MouseUp, new Point(event.point.x, event.point.y), this.lastMouse);

            this.onMouseUp(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    public mouseMoveWrapper(event: DrawEvent, sendToServer: boolean): void {
        if (this.isMouseDown) {
            var event = this.createEvent(DrawEventType.MouseDrag, new Point(event.point.x, event.point.y), this.lastMouse);

            this.path.push(event.point);

            this.onMouseDrag(event);

            this.lastMouse = new Point(event.point.x, event.point.y);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    public applyStyles(context: CanvasRenderingContext2D): void {
        for (var style in this.behavior.styles) {
            context[style] = this.behavior.styles[style];
        }

        context.fillStyle = this.behavior.color;
        context.strokeStyle = this.behavior.color;
    }

    public setBehavior(behavior: ToolBehavior): void {
        this.behavior = behavior;

        this.applyStyles(this.finalContext);
        this.applyStyles(this.bufferContext);
    }

    public createEvent(type: DrawEventType, point: Point, lastPoint: Point): DrawEvent {
        return new DrawEvent(type, point, lastPoint, this.behavior.name, this.behavior.color);
    }

    public release(): void {
        if (this.lastMouse != null) {
            this.onMouse(this.createEvent(DrawEventType.MouseUp, this.lastMouse, this.lastMouse));
        }
    }
}

class LocalTool extends Tool {
    constructor(userId: string, canvas: Canvas) {
        super(userId, canvas);

        this.addListeners();
    }

    private handleUserClick(e: JQueryMouseEventObject): void {
        requestAnimationFrame(() => {
            if (this.canvas.localInputEnabled) {
                this.lastMouse = new Point(e.clientX, e.clientY);

                var event = this.createEvent(DrawEventType.MouseDown, new Point(e.offsetX, e.offsetY), this.lastMouse);

                this.mouseDownWrapper(event, true);
            }
        });
    }

    private handleUserRelease(e: JQueryMouseEventObject): void {
        requestAnimationFrame(() => {
            if (this.canvas.localInputEnabled && this.isMouseDown) {
                var canvasPosition = this.$finalCanvas.offset();
                var mousePoint = new Point(e.clientX - canvasPosition.left, e.clientY - canvasPosition.top);

                var event = this.createEvent(DrawEventType.MouseUp, mousePoint, this.lastMouse);

                this.mouseUpWrapper(event, true);
            }
        });
    }

    private handleUserMove(e: JQueryMouseEventObject): void {
        requestAnimationFrame(() => {
            if (this.canvas.localInputEnabled && this.isMouseDown) {
                var canvasPosition = this.$finalCanvas.offset();
                var mousePoint = new Point(e.clientX - canvasPosition.left, e.clientY - canvasPosition.top);

                var event = this.createEvent(DrawEventType.MouseDrag, mousePoint, this.lastMouse);

                this.mouseMoveWrapper(event, true);
            }
        });
    }

    private addListeners(): void {
        $("#bufferContainer").mousedown(e => this.handleUserClick(e));

        $(document.body).mouseup(e => this.handleUserRelease(e));

        $(document.body).mousemove(e => this.handleUserMove(e));
    }

    public clear(): void {
        this.release();

        this.bufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.finalContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
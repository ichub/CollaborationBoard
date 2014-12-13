class Tool {
    public userId: string;
    public canvas: Canvas;
    public $bufferCanvas: JQuery;
    public $finalCanvas: JQuery;
    public bufferContext: CanvasRenderingContext2D;
    public finalContext: CanvasRenderingContext2D;
    public isMouseDown: boolean;
    public lastMouse: Point;
    public path: Array<Point>;

    public behavior: ToolBehavior;

    public constructor(userId: string, canvas: Canvas) {
        this.userId = userId;
        this.canvas = canvas;

        this.$finalCanvas = canvas.$finalCanvas;
        this.finalContext = (<HTMLCanvasElement> this.$finalCanvas.get(0)).getContext("2d");

        this.$bufferCanvas = this.createBuffer();
        this.bufferContext = (<HTMLCanvasElement> this.$bufferCanvas.get(0)).getContext("2d");

        this.path = [];

        this.isMouseDown = false;
        this.lastMouse = null;

        this.setBehavior(new DrawBehavior(this));
    }

    public dispose() {
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
        this.setToolFromName(event.toolBehaviorName);

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

    public setToolFromName(toolBehaviorName: string) {
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

    public mouseDownWrapper(event: DrawEvent, sendToServer: boolean) {
        if (this.canvas.enabled) {
            this.isMouseDown = true;

            this.lastMouse = new Point(event.point.x, event.point.y);

            var event = new DrawEvent(DrawEventType.MouseDown, this.lastMouse, this.lastMouse, event.toolBehaviorName);
            this.onMouseDown(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    public mouseUpWrapper(event: DrawEvent, sendToServer: boolean) {
        if (this.canvas.enabled && this.isMouseDown) {
            this.isMouseDown = false;

            var event = new DrawEvent(DrawEventType.MouseUp, new Point(event.point.x, event.point.y), this.lastMouse, event.toolBehaviorName);

            this.onMouseUp(event);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    public mouseMoveWrapper(event: DrawEvent, sendToServer: boolean) {
        if (this.canvas.enabled && this.isMouseDown) {
            var event = new DrawEvent(DrawEventType.MouseDrag, new Point(event.point.x, event.point.y), this.lastMouse, event.toolBehaviorName);

            this.path.push(event.point);

            this.onMouseDrag(event);

            this.lastMouse = new Point(event.point.x, event.point.y);

            if (sendToServer) {
                this.canvas.sendDrawEvent(event);
            }
        }
    }

    public applyStyles(context: CanvasRenderingContext2D) {
        for (var style in this.behavior.styles) {
            context[style] = this.behavior.styles[style];
        }

        context.fillStyle = this.behavior.color;
        context.strokeStyle = this.behavior.color;
    }

    public setBehavior(behavior: ToolBehavior) {
        this.behavior = behavior;

        this.applyStyles(this.finalContext);
        this.applyStyles(this.bufferContext);
    }
}

class LocalTool extends Tool {
    constructor(userId: string, canvas: Canvas) {
        super(userId, canvas);

        this.addListeners();
    }

    private addListeners(): void {
        $("#bufferContainer").mousedown(e => {
            requestAnimationFrame(() => {
                this.lastMouse = new Point(e.clientX, e.clientY);

                var event = new DrawEvent(DrawEventType.MouseDown, new Point(e.clientX, e.clientY), this.lastMouse, this.behavior.name);

                this.mouseDownWrapper(event, true);
            });
        });

        $(document.body).mouseup(e => {
            requestAnimationFrame(() => {
                if (this.canvas.enabled && this.isMouseDown) {
                    var event = new DrawEvent(DrawEventType.MouseUp, new Point(e.clientX, e.clientY), this.lastMouse, this.behavior.name);

                    this.mouseUpWrapper(event, true);
                }
            });
        });

        $(document.body).mousemove(e => {
            requestAnimationFrame(() => {
                if (this.canvas.enabled && this.isMouseDown) {
                    var event = new DrawEvent(DrawEventType.MouseDrag, new Point(e.clientX, e.clientY), this.lastMouse, this.behavior.name);

                    this.mouseMoveWrapper(event, true);
                }
            });
        });
    }
}
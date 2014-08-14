class DrawTool {
    private canvas: Canvas;
    private $canvas: JQuery;
    private context: CanvasRenderingContext2D;
    private isMouseDown: boolean;
    private lastMouse: Point;

    public constructor(canvas: Canvas) {
        this.$canvas = canvas.$canvas;
        this.canvas = canvas;
        this.context = (<HTMLCanvasElement> this.$canvas.get(0)).getContext("2d");

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

    private initializeStyle(): void {
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 5;
    }

    private onMouseDown(event: DrawEvent): void {
    }

    private onMouseUp(event: DrawEvent): void {
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

        this.$canvas.mouseup(e => {
            if (this.canvas.enabled) {
                this.isMouseDown = false;

                var event = new DrawEvent(DrawEventType.MouseUp, new Point(e.clientX, e.clientY), this.lastMouse);
                this.onMouseDown(event);

                this.canvas.sendDrawEvent(event);
            }
        });

        this.$canvas.mousemove(e => {
            if (this.canvas.enabled) {
                if (this.isMouseDown) {
                    var event = new DrawEvent(DrawEventType.MouseDrag, new Point(e.clientX, e.clientY), this.lastMouse);
                    this.onMouseDrag(event);

                    this.lastMouse = new Point(e.clientX, e.clientY);

                    this.canvas.sendDrawEvent(event);
                }
            }
        });
    }
} 
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

    private onMouseDown(event: DrawEvent): void {
    }

    private onMouseUp(event: DrawEvent): void {
    }

    private onMouseDrag(event: DrawEvent): void {
        this.context.beginPath();
        this.context.moveTo(event.point.x, event.point.y);
        this.context.lineTo(event.lastPoint.x, event.lastPoint.y);
        this.context.stroke();
    }

    private addListeners(): void {
        this.$canvas.mousedown(e => {
            this.isMouseDown = true;

            this.lastMouse = new Point(e.clientX, e.clientY);

            var event = new DrawEvent(DrawEventType.MouseDown, new Point(e.clientX, e.clientY), new Point(this.lastMouse.x, this.lastMouse.y));
            this.onMouseDown(event);

            this.canvas.sendDrawEvent(event);
        });

        this.$canvas.mouseup(e => {
            this.isMouseDown = false;

            var event = new DrawEvent(DrawEventType.MouseUp, new Point(e.clientX, e.clientY), new Point(this.lastMouse.x, this.lastMouse.y));
            this.onMouseDown(event);

            this.canvas.sendDrawEvent(event);
        });

        this.$canvas.mousemove(e => {
            if (this.isMouseDown) {
                var event = new DrawEvent(DrawEventType.MouseDrag, new Point(e.clientX, e.clientY), new Point(this.lastMouse.x, this.lastMouse.y));
                this.onMouseDrag(event);

                this.lastMouse = new Point(e.clientX, e.clientY);

                this.canvas.sendDrawEvent(event);
            }
        });
    }
} 
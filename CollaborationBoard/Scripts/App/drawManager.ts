class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface MouseState {
    pos: Point;
    lastPos: Point;
    down: boolean;
    initialized: boolean;
}

interface DragState {
    x: number;
    y: number;
    mx: number;
    my: number;
}

enum ManagerState {
    Drawing,
    Dragging
}

class DrawManager {
    manager: BoardManager;
    $canvas: JQuery;
    $parent: JQuery;
    context: CanvasRenderingContext2D;
    ms: MouseState;
    drag: DragState;
    state: ManagerState;
    width: number;
    height: number;

    constructor(manager: BoardManager, $canvas: JQuery) {
        this.manager = manager;

        this.width = 800;
        this.height = 600;

        var canvas = <HTMLCanvasElement> $canvas.get(0);

        this.$canvas = $canvas;
        this.$parent = $canvas.parent();
        this.context = canvas.getContext("2d");

        this.ms = {
            pos: new Point(0, 0),
            lastPos: new Point(0, 0),
            down: false,
            initialized: false
        };

        this.drag = {
            x: 0,
            y: 0,
            mx: 0,
            my: 0
        };

        this.state = ManagerState.Drawing;

        this.$canvas.css({
            width: this.width,
            height: this.height
        });

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.initializeNetwork();
    }

    enable(): void {
        this.addListeners();
        this.resetDrawingSettings();
    }

    initializeNetwork(): void {
        this.manager.board.client.draw = (cid: string, x1: number, y1: number, x2: number, y2: number) => {
            if (cid != this.manager.clientId) {
                this.drawLine(new Point(x1, y1), new Point(x2, y2));
            }
        };
    }

    addListeners(): void {
        $(window).mousedown((e: JQueryEventObject): void => {
            this.updateMouseDown(e);

            if (this.state == ManagerState.Dragging) {
                this.onDragStart();
            }
            else {
                this.onDrawStart();
            }
        });

        $(window).mouseup((e: JQueryEventObject): void => {
            this.updateMouseUp(e);

            if (this.state == ManagerState.Dragging) {
                this.onDragEnd();
            }
            else {
                this.onDrawEnd();
            }
        });

        $(window).mousemove((e: JQueryEventObject): void => {
            this.updateMousePosition(e);

            if (this.ms.down) {
                if (this.state == ManagerState.Dragging) {
                    this.onDrag();
                }
                else {
                    this.onDraw();
                }
            }
        });
    }

    resetDrawingSettings(): void {
        this.context.strokeStyle = "#000";
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 10;
    }

    updateMouseDown(e: JQueryEventObject): void {
        if (e.button == 0) {
            this.ms.down = true;
        }
    }

    updateMouseUp(e: JQueryEventObject): void {
        if (e.button == 0) {
            this.ms.down = false;
        }
    }

    updateMousePosition(e: JQueryEventObject): void {
        var coords = this.$canvas.position();

        if (!this.ms.initialized) {
            this.ms.initialized = true;

            this.ms.pos.x = e.clientX - coords.left;
            this.ms.pos.y = e.clientY - coords.top;
            this.ms.lastPos.x = this.ms.pos.x;
            this.ms.lastPos.y = this.ms.pos.y;
        }
        else {
            this.ms.lastPos.x = this.ms.pos.x;
            this.ms.lastPos.y = this.ms.pos.y;
            this.ms.pos.x = e.clientX - coords.left;
            this.ms.pos.y = e.clientY - coords.top;
        }
    }

    onDrag(): void {
        var newX = this.ms.pos.x - this.drag.mx + this.drag.x;
        var newY = this.ms.pos.y - this.drag.mx + this.drag.y;

        this.$canvas.offset({
            top: newY,
            left: newX
        })
    }

    onDragStart(): void {
        var coords = this.$canvas.position();

        this.drag.x = coords.left;
        this.drag.y = coords.top;
        this.drag.mx = this.ms.pos.x;
        this.drag.my = this.ms.pos.y;
    }

    onDragEnd(): void {
    }

    onDraw(): void {
        this.drawLine(this.ms.pos, this.ms.lastPos);
        this.manager.sendServerDraw(this.ms.pos, this.ms.lastPos);
    }

    onDrawStart(): void {
    }

    onDrawEnd(): void {
    }

    drawLine(from: Point, to: Point): void {
        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.stroke();
    }
}

onload = (): void=> {
    var manager = new BoardManager();
}
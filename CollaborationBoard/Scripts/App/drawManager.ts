interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

interface BoardClient {
    draw(cid: string, x1: number, y1: number, x2: number, y2: number);
}

interface BoardServer {
    draw(x1: number, y1: number, x2: number, y2: number);
}

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
    $canvas: JQuery;
    $parent: JQuery;
    context: CanvasRenderingContext2D;
    board: HubProxy;
    ms: MouseState;
    drag: DragState;
    state: ManagerState;
    width: number;
    height: number;

    constructor($canvas: JQuery) {
        this.width = 800;
        this.height = 600;

        var canvas = <HTMLCanvasElement> $canvas.get(0);

        this.$canvas = $canvas;
        this.$parent = $canvas.parent();
        this.context = canvas.getContext("2d");
        this.board = $.connection.boardHub;

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

        this.addListeners();
        this.resetDrawingSettings();
        this.initializeConnection();
    }

    addListeners() {
        $(window).mousedown((e: JQueryEventObject) => {
            this.updateMouseDown(e);

            if (this.state == ManagerState.Dragging) {
                this.onDragStart();
            }
            else {
                this.onDrawStart();
            }
        });

        $(window).mouseup((e: JQueryEventObject) => {
            this.updateMouseUp(e);

            if (this.state == ManagerState.Dragging) {
                this.onDragEnd();
            }
            else {
                this.onDrawEnd();
            }
        });

        $(window).mousemove((e: JQueryEventObject) => {
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

    resetDrawingSettings() {
        this.context.strokeStyle = "#000";
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 10;
    }

    initializeConnection() {
        var that = this;

        this.board.client.draw = (cid: string, x1: number, y1: number, x2: number, y2: number) => {
            if (cid != $.connection.id) {
                this.drawLine(new Point(x1, y1), new Point(x2, y2));
            }
        };

        $.connection.hub.start().done(function () {
            alert();
        });
    }

    updateMouseDown(e: JQueryEventObject) {
        if (e.button == 0) {
            this.ms.down = true;
        }
    }

    updateMouseUp(e: JQueryEventObject) {
        if (e.button == 0) {
            this.ms.down = false;
        }
    }

    updateMousePosition(e: JQueryEventObject) {
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

    onDrag() {
        var newX = this.ms.pos.x - this.drag.mx + this.drag.x;
        var newY = this.ms.pos.y - this.drag.mx + this.drag.y;

        this.$canvas.offset({
            top: newY,
            left: newX
        })
    }

    onDragStart() {
        var coords = this.$canvas.position();

        this.drag.x = coords.left;
        this.drag.y = coords.top;
        this.drag.mx = this.ms.pos.x;
        this.drag.my = this.ms.pos.y;
    }

    onDragEnd() {
    }

    onDraw() {
        this.drawLine(this.ms.pos, this.ms.lastPos);
        this.sendServerDraw(this.ms.pos, this.ms.lastPos);
    }

    onDrawStart() {
    }

    onDrawEnd() {
    }

    drawLine(from: Point, to: Point) {
        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.stroke();
    }

    sendServerDraw(from: Point, to: Point) {
        this.board.server.draw(from.x, from.y, to.x, to.y);
    }
}

onload = () => {
    var manager = new DrawManager($("#drawCanvas"));
}
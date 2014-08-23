enum DrawEventType {
    MouseDown,
    MouseDrag,
    MouseUp
}

interface JQuery {
    draggable(...params: Array<any>);
    resizable();
}

interface BoardClient {
    onDrawEvent(event: DrawEvent);
    onMouseMove(cid: string, x: number, y: number);
}

interface BoardServer {
    onDrawEvent(event: DrawEvent);
    onMouseMove(x: number, y: number);
}

class DrawEvent {
    public type: DrawEventType;
    public cid: string;
    public point: Point;
    public lastPoint: Point;

    constructor(type: DrawEventType, point: Point, lastPoint: Point, cid = "me") {
        this.type = type;
        this.cid = cid;
        this.point = point.round();
        this.lastPoint = lastPoint.round();
    }
}

class Canvas {
    public $canvas: JQuery;
    public entities: EntityCollection;

    private $container: JQuery;
    private manager: Application;
    private tool: DrawTool;
    private cursors: any;
    private _enabled: boolean;

    public constructor(manager: Application, canvasId: string) {
        this.$canvas = $("#" + canvasId);
        this.$container = this.$canvas.parent();

        var elem = <HTMLCanvasElement> this.$canvas.get(0);

        elem.width = this.$canvas.width();
        elem.height = this.$canvas.height();

        this.manager = manager;
        this.cursors = new Object();
        this._enabled = false;

        this.initializeNetwork();
        this.addListeners();

        this.tool = new DrawTool(this);
        this.entities = new EntityCollection();
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
    }

    private initializeNetwork(): void {
        this.manager.hub.client.onDrawEvent = (event: DrawEvent) => {
            this.tool.onMouse(event);
        };

        this.manager.hub.client.onMouseMove = (cid: string, x: number, y: number): void=> {
            if (!this.cursors[cid]) {
                this.cursors[cid] = new Cursor();
            }

            this.cursors[cid].setPosition(x, y);
        };
    }

    private addListeners(): void {
        this.$canvas.mousemove((e: JQueryMouseEventObject): void=> {
            if (this.enabled) {
                this.sendMouseMove(e.clientX, e.clientY);
            }
        });
    }

    public sendDrawEvent(event: DrawEvent): void {
        this.manager.hub.server.onDrawEvent(event);
    }

    private sendMouseMove(x: number, y: number): void {
        this.manager.hub.server.onMouseMove(x, y);
    }

    public processLoadEvents(events: Array<DrawEvent>): void {
        for (var i = 0; i < events.length; i++) {
            this.tool.onMouse(events[i]);
        }
    }

    public onUserConnect(cid: string): void {
        console.log(format("user %s connected", cid));
    }

    public onUserDisconnect(cid: string): void {
        console.log(format("user %s disconnected", cid));
    }
}
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

    constructor(type: DrawEventType, point: Point, lastPoint: Point) {
        this.type = type;
        this.point = point.round();
        this.lastPoint = lastPoint.round();
        this.cid = "";
    }
}

class Canvas {
    public $finalCanvas: JQuery;

    public entities: EntityCollection;
    public app: Application;

    private $container: JQuery;
    private tool: DrawTool;
    private cursors: any;
    private _enabled: boolean;

    public constructor(manager: Application) {
        this.$finalCanvas = $("#finalDrawCanvas");
        this.$container = this.$finalCanvas.parent();

        var elem = <HTMLCanvasElement> this.$finalCanvas.get(0);

        elem.width = this.$finalCanvas.width();
        elem.height = this.$finalCanvas.height();

        this.app = manager;
        this.cursors = new Object();
        this._enabled = false;

        this.initializeNetwork();
        this.addListeners();

        this.tool = new DrawTool(this);
        this.entities = new EntityCollection(this);
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
    }

    private initializeNetwork(): void {
        this.app.hub.client.onDrawEvent = (event: DrawEvent) => {
            this.tool.onMouse(event);
        };

        this.app.hub.client.onMouseMove = (cid: string, x: number, y: number): void=> {
            if (!this.cursors[cid]) {
                this.cursors[cid] = new Cursor();
            }

            this.cursors[cid].setPosition(x, y);
        };
    }

    private addListeners(): void {
        //this.$canvas.mousemove((e: JQueryMouseEventObject): void=> {
        //    if (this.enabled) {
        //        this.sendMouseMove(e.clientX, e.clientY);
        //    }
        //});
    }

    public sendDrawEvent(event: DrawEvent): void {
        this.app.hub.server.onDrawEvent(event);
    }

    private sendMouseMove(x: number, y: number): void {
        this.app.hub.server.onMouseMove(x, y);
    }

    private processLoadEvents(events: Array<DrawEvent>): void {
        for (var i = 0; i < events.length; i++) {
            this.tool.onMouse(events[i]);
        }
    }

    private processLoadEntities(snapshot: BoardSnapshot) {
        for (var i = 0; i < snapshot.textEntities.length; i++) {
            var entity = snapshot.textEntities[i];
            entity.position = Point.deserialize(entity.position);

            this.entities.addTextEntity(entity.id, entity.text, entity.position);
        }
    }

    public initializeFromSnapshot(snapshot: BoardSnapshot): void {
        this.processLoadEvents(snapshot.events);
        this.processLoadEntities(snapshot);
    }

    public onUserConnect(user: UserInfo): void {
        console.log(format("user %s connected", user.id));
    }

    public onUserDisconnect(user: UserInfo): void {
        console.log(format("user %s disconnected", user.id));
    }

    public get width() {
        return this.$finalCanvas.width();
    }

    public get height() {
        return this.$finalCanvas.height();
    }
}
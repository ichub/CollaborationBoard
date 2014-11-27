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
    onToolChange(userId: string, toolName: string): void;
}

interface BoardServer {
    onDrawEvent(event: DrawEvent);
    onToolChange(toolName: string): void;
}

class DrawEvent {
    public type: DrawEventType;
    public id: string;
    public point: Point;
    public lastPoint: Point;
    public toolBehaviorName: string;

    constructor(type: DrawEventType, point: Point, lastPoint: Point, toolBehaviorName: string) {
        this.type = type;
        this.point = point.round();
        this.lastPoint = lastPoint.round();
        this.id = "";
        this.toolBehaviorName = toolBehaviorName;
    }
}

class Canvas {
    public $finalCanvas: JQuery;

    public _entities: EntityCollection;
    public _app: Application;

    private $container: JQuery;
    private tool: Tool;
    private toolCollection: Object;
    private _enabled: boolean;

    public toolBox: ToolBox;

    public constructor(manager: Application) {
        this.$finalCanvas = $("#finalDrawCanvas");
        this.$container = this.$finalCanvas.parent();

        var elem = <HTMLCanvasElement> this.$finalCanvas.get(0);

        elem.width = this.$finalCanvas.width();
        elem.height = this.$finalCanvas.height();

        this._app = manager;
        this.toolBox = new ToolBox(this.app);
        this._enabled = false;

        this.initializeNetwork();

        this.toolCollection = new Object();

        this._entities = new EntityCollection(this);
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
    }

    private initializeNetwork(): void {
        this._app.hub.client.onDrawEvent = (event: DrawEvent) => {
            if (!this.toolCollection[event.id]) {
                this.toolCollection[event.id] = new Tool(this, true);
            }

            this.toolCollection[event.id].onMouse(event);
        };

        this.app.hub.client.onToolChange = (userId: string, toolName: string) => {
            if (this.app.user.id == userId) {
                this.toolBox.setTool(toolName, false);
            }
        };
    }

    public sendDrawEvent(event: DrawEvent): void {
        this._app.hub.server.onDrawEvent(event);
    }

    private processLoadEvents(events: Array<DrawEvent>): void {
        for (var i = 0; i < events.length; i++) {
            if (!this.toolCollection[events[i].id]) {
                this.toolCollection[events[i].id] = new Tool(this, true);
            }

            this.toolCollection[events[i].id].onMouse(events[i]);
        }
    }

    private processLoadEntities(snapshot: BoardSnapshot) {
        for (var i = 0; i < snapshot.textEntities.length; i++) {
            var entity = snapshot.textEntities[i];
            entity.position = Point.deserialize(entity.position);

            this._entities.addTextEntity(entity.id, entity.text, entity.position);
        }
    }

    public initializeFromSnapshot(snapshot: BoardSnapshot): void {
        for (var i = 0; i < snapshot.neighbors.length; i++) {
            this.toolCollection[snapshot.neighbors[i]] = new Tool(this, true);
        }

        this.processLoadEvents(snapshot.events);
        this.processLoadEntities(snapshot);
    }

    public addLocalUser() {
        this.toolCollection[this.app.user.id] = new Tool(this, false);
    }

    public onUserConnect(user: UserInfo): void {
        console.log(format("user %s connected", user.id));

        if (this.toolCollection[user.id]) {
            this.toolCollection[user.id] = new Tool(this, false);
        }
    }

    public onUserDisconnect(user: UserInfo): void {
        console.log(format("user %s disconnected", user.id));

        this.toolCollection[user.id].dispose();

        delete this.toolCollection[user.id];
    }

    public get width() {
        return this.$finalCanvas.width();
    }

    public get height() {
        return this.$finalCanvas.height();
    }

    public get userTool(): Tool {
        return this.toolCollection[this._app.user.id];
    }

    public get app(): Application {
        return this._app;
    }

    public get entities(): EntityCollection {
        return this._entities;
    }
}
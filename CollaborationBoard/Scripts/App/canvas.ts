enum DrawEventType {
    MouseDown,
    MouseDrag,
    MouseUp
}

interface JQuery {
    draggable(...params: Array<any>);
    resizable();
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
    public $container: JQuery;

    public entitites: EntityCollection;
    public app: Application;
    public toolCollection: Object;
    public toolBox: ToolBox;
    public enabled: boolean;
    public width: number;
    public height: number;

    public constructor(manager: Application) {
        this.$finalCanvas = $("#finalDrawCanvas");
        this.$container = this.$finalCanvas.parent();

        var elem = <HTMLCanvasElement> this.$finalCanvas.get(0);

        elem.width = this.$finalCanvas.width();
        elem.height = this.$finalCanvas.height();

        this.app = manager;
        this.toolBox = new ToolBox(this.app);
        this.enabled = false;

        this.initializeNetwork();

        this.toolCollection = new Object();

        this.entitites = new EntityCollection(this);

        this.width = this.$container.width();
        this.height = this.$container.height();
    }

    private initializeNetwork(): void {
        this.app.hub.client.onDrawEvent = (event: DrawEvent) => {
            this.addUserToolIfDoesNotExist(event.id);

            this.toolCollection[event.id].onMouse(event);
        };

        this.app.hub.client.onToolChange = (userId: string, toolName: string) => {
            if (this.app.user.id == userId) {
                this.toolBox.setTool(toolName, false);
            }
        };
    }

    public sendDrawEvent(event: DrawEvent): void {
        this.app.hub.server.onDrawEvent(event);
    }

    private processLoadEvents(events: Array<DrawEvent>): void {
        for (var i = 0; i < events.length; i++) {
            this.addUserToolIfDoesNotExist(events[i].id);

            this.toolCollection[events[i].id].onMouse(events[i]);
        }
    }

    private processLoadEntities(snapshot: BoardSnapshot) {
        for (var i = 0; i < snapshot.textEntities.length; i++) {
            var entity = snapshot.textEntities[i];
            entity.position = Point.deserialize(entity.position);

            this.entitites.addTextEntity(entity.id, entity.text, entity.position);
        }
    }

    public initializeFromSnapshot(snapshot: BoardSnapshot): void {
        this.addLocalUser();
        this.enabled = true;

        this.processLoadEvents(snapshot.events);
        this.processLoadEntities(snapshot);
    }

    public addLocalUser() {
        this.toolCollection[this.app.user.id] = new LocalTool(this);
    }

    public onUserConnect(user: UserInfo): void {
        console.log(format("user %s connected", user.id));

        this.addUserToolIfDoesNotExist(user.id);
    }

    public onUserDisconnect(user: UserInfo): void {
        console.log(format("user %s disconnected", user.id));

        this.toolCollection[user.id].dispose();

        delete this.toolCollection[user.id];
    }

    public addUserToolIfDoesNotExist(userid: string) {
        if (!this.toolCollection[userid]) {
            this.toolCollection[userid] = new Tool(this);
        }
    }

    public get userTool(): Tool {
        return this.toolCollection[this.app.user.id];
    }
}
enum DrawEventType {
    MouseDown,
    MouseDrag,
    MouseUp
}

interface JQuery {
    draggable(...params: Array<any>);
    resizable();
}

class Canvas {
    public $finalCanvas: JQuery;
    public $container: JQuery;

    public entitites: EntityCollection;
    public app: Application;
    public toolCollection: { [id: string]: Tool; } = {};
    public toolBox: ToolBox;
    public localInputEnabled: boolean = false;
    public networkInputEnabled: boolean = true;
    public width: number;
    public height: number;

    private draggingMode: boolean = false;
    private dragStarted: boolean = false;
    private boundsPadding: number = 300;
    private mouseOffset: { x: number; y: number } = { x: 0, y: 0 };
    private canvasOffset: { x: number; y: number } = { x: 0, y: 0 };

    public constructor(manager: Application) {
        this.$finalCanvas = $("#finalDrawCanvas");
        this.$container = this.$finalCanvas.parent();

        var elem = <HTMLCanvasElement> this.$finalCanvas.get(0);

        elem.width = this.$finalCanvas.width();
        elem.height = this.$finalCanvas.height();

        this.app = manager;
        this.toolBox = new ToolBox(this.app);

        this.initializeNetwork();

        this.entitites = new EntityCollection(this);

        this.width = this.$container.width();
        this.height = this.$container.height();

        this.initializeCanvasDragging();
    }

    private initializeCanvasDragging(): void  {
        $(document.body).keydown(e => {
            if (!this.draggingMode && e.keyCode == 18 /* alt */) {
                this.setPossibleDraggingCursor();

                this.userTool.release();

                this.draggingMode = true;
                this.localInputEnabled = false;
            }
        });

        $(document.body).keyup(e => {
            if (e.keyCode == 18 /* alt */) {
                this.setDefaultCursor();

                this.draggingMode = false;
                this.dragStarted = false;
                this.localInputEnabled = true;
            }
        });

        this.$container.mousedown(e => {
            if (this.draggingMode) {
                this.setDefinitelyDraggingCursor();

                this.dragStarted = true;
                this.mouseOffset = {
                    x: e.clientX,
                    y: e.clientY
                };

                this.canvasOffset = {
                    x: this.$container.offset().left,
                    y: this.$container.offset().top,
                }
            }
        });

        $(document.body).mousemove(e => {
            if (this.dragStarted) {

                var newPosition = {
                    left: this.canvasOffset.x + e.clientX - this.mouseOffset.x,
                    top: this.canvasOffset.y + e.clientY - this.mouseOffset.y
                }

                this.$container.offset(newPosition);

                if (this.isOutOfBounds(newPosition)) {
                    this.moveIntoBounds();
                }
            }
        });

        $(document.body).mouseup(e => {
            if (this.dragStarted) {
                this.setPossibleDraggingCursor();

                this.dragStarted = false;
            }
        });

        $(document.body).resize(e => {
            this.moveIntoBounds();
        });

        $(document.body).keydown(e => {
            if (!this.dragStarted && e.keyCode == 82 /* r */) {
                this.resetPosition();
            }
        });
    }

    private isOutOfBounds(pos: JQueryCoordinates): boolean{
        return pos.left + this.boundsPadding > window.innerWidth ||
            pos.top + this.boundsPadding > window.innerHeight ||
            pos.top + this.height - this.boundsPadding < 0 ||
            pos.left + this.width - this.boundsPadding < 0;
    }

    private moveIntoBounds(): void  {
        this.$container.offset({
            left: Math.max(this.boundsPadding - this.width, Math.min(window.innerWidth - this.boundsPadding, this.$container.offset().left)),
            top: Math.max(this.boundsPadding - this.height, Math.min(window.innerHeight - this.boundsPadding, this.$container.offset().top))
        });
    }

    private resetPosition(): void  {
        this.$container.css({
            top: "",
            left: ""
        });
    }

    private setPossibleDraggingCursor(): void {
        this.$container.css("cursor", "-webkit-grab");
    }

    private setDefinitelyDraggingCursor(): void {
        this.$container.css("cursor", "-webkit-grabbing");
    }

    private setDefaultCursor(): void {
        this.$container.css("cursor", "pointer");
    }

    private initializeNetwork(): void {
        this.app.hub.client.onClear = (id: string) => {
            if (this.networkInputEnabled) {
                this.clear();
            }
        };

        this.app.hub.client.onDrawEvent = (event: DrawEvent) => {
            if (this.networkInputEnabled) {
                this.addUserToolIfDoesNotExist(event.id);

                this.toolCollection[event.id].onMouse(event);
            }
        };

        this.app.hub.client.onToolChange = (userId: string, toolName: string) => {
            if (this.networkInputEnabled) {
                if (this.app.user.id == userId) {
                    this.toolBox.setTool(toolName, false);
                }
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

    private processLoadEntities(snapshot: BoardSnapshot): void  {
        for (var i = 0; i < snapshot.textEntities.length; i++) {
            var entity = snapshot.textEntities[i];
            entity.position = Point.deserialize(entity.position);

            this.entitites.addTextEntity(entity.id, entity.text, entity.position);
        }

        this.userTool.release();
    }

    public initializeFromSnapshot(snapshot: BoardSnapshot): void {
        this.addLocalUser();
        this.localInputEnabled = true;

        this.processLoadEvents(snapshot.events);
        this.processLoadEntities(snapshot);
    }

    public addLocalUser(): void  {
        this.toolCollection[this.app.user.id] = new LocalTool(this.app.user.id, this);
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

    public addUserToolIfDoesNotExist(userId: string): void  {
        if (!this.toolCollection[userId]) {
            this.toolCollection[userId] = new Tool(userId, this);
        }
    }

    public get userTool(): LocalTool {
        return <LocalTool> this.toolCollection[this.app.user.id];
    }

    public clear(): void  {
        this.userTool.clear();
    }
}
declare var paper;

enum DrawEventType {
    MouseDown,
    MouseDrag,
    MouseUp
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
    public x: number;
    public y: number;

    constructor(type: DrawEventType, x: number, y: number, cid = undefined) {
        this.type = type;
        this.cid = cid;
        this.x = x;
        this.y = y;
    }
}

class DrawManager {
    private $canvas: JQuery;
    private manager: BoardManager;
    private cursors: any;
    private userPaths: any;
    private tool: any;
    private _enabled: boolean;

    public constructor(manager: BoardManager, canvasId: string) {
        this.$canvas = $("#" + canvasId);
        this.manager = manager;
        this.cursors = new Object();
        this.userPaths = new Object();
        this.enabled = false;

        paper.setup(canvasId);
        this.tool = this.createTool();

        this.initializeNetwork();
        this.addListeners();
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
    }

    private spoofEvent(x: number, y: number): any {
        var result = new paper.ToolEvent();

        result.point = new paper.Point(x, y);
        result.tool = this.tool;
        return result;
    }


    private initializeNetwork(): void {
        this.manager.hub.client.onDrawEvent = (event: DrawEvent) => {
            this.processDrawEvent(event);
        };

        this.manager.hub.client.onMouseMove = (cid: string, x: number, y: number): void=> {
            if (!this.cursors[cid]) {
                this.cursors[cid] = new Cursor();
            }

            this.cursors[cid].setPosition(x, y);
        };
    }

    private createTool(): any {
        var tool = new paper.Tool();

        this.userPaths.own = new paper.Path();

        tool.onMouseDown = (event: any, userId= this.userPaths.own, isLocalChange = true): void => {
            if (this.enabled) {
                var path = (this.userPaths[userId] = new paper.Path());
                path.strokeWidth = 0;
                if (isLocalChange) {
                    path.strokeCap = "round";
                    path.strokeColor = "black";
                    path.fullySelected = true;
                }

                path.add(event.point);

                if (isLocalChange) {
                    this.sendDrawEvent(DrawEventType.MouseDown, event);
                }
            }
        };

        tool.onMouseDrag = (event: any, userId= this.userPaths.own, isLocalChange = true): void=> {
            if (this.enabled) {
                var path = this.userPaths[userId];

                path.add(event.point);

                if (isLocalChange) {
                    this.sendDrawEvent(DrawEventType.MouseDrag, event);
                }
            }
        };

        tool.onMouseUp = (event: any, userId= this.userPaths.own, isLocalChange = true): void => {
            if (this.enabled) {
                var path = this.userPaths[userId];

                path.simplify(10);
                path.strokeWidth = 5;
                path.fullySelected = false;
                path.strokeColor = "black";
                path.strokeCap = "round";

                if (isLocalChange) {
                    this.sendDrawEvent(DrawEventType.MouseUp, event);
                }
            }
        };

        return tool;
    }

    private addListeners(): void {
        this.$canvas.mousemove((e: JQueryMouseEventObject): void=> {
            this.sendMouseMove(e.clientX, e.clientY);
        });
    }

    private sendDrawEvent(type: DrawEventType, event: any): void {
        this.manager.hub.server.onDrawEvent(new DrawEvent(type, event.point.x, event.point.y));
    }

    private sendMouseMove(x: number, y: number): void {
        this.manager.hub.server.onMouseMove(x, y);
    }

    private processDrawEvent(event: DrawEvent): void {
        var x = event.x;
        var y = event.y;
        var cid = event.cid;

        switch (event.type) {
            case DrawEventType.MouseDown:
                this.tool.onMouseDown(this.spoofEvent(x, y), cid, false);
                break;
            case DrawEventType.MouseDrag:
                this.tool.onMouseDrag(this.spoofEvent(x, y), cid, false);
                break;
            case DrawEventType.MouseUp:
                this.tool.onMouseUp(this.spoofEvent(x, y), cid, false);
                break;
        }

        paper.view.draw();
    }

    public processLoadEvents(events: Array<DrawEvent>): void {
        for (var i = 0; i < events.length; i++) {
            this.processDrawEvent(events[i]);
        }
    }

    public onUserConnect(cid: string): void{
        console.log(format("user %s connected", cid));
    }

    public onUserDisconnect(cid: string): void{
        console.log(format("user %s disconnected", cid));
    }
}
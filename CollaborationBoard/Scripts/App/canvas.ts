enum DrawEventType {
    MouseDown,
    MouseDrag,
    MouseUp
}

interface JQuery {
    draggable(...params: Array<any>);
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

class Canvas {
    private $canvas: JQuery;
    private $container: JQuery;
    private manager: Application;
    private cursors: any;
    private _enabled: boolean;

    public constructor(manager: Application, canvasId: string) {
        this.$canvas = $("#" + canvasId);
        this.$container = this.$canvas.parent();

        //this.$canvas.draggable({
        //    cursor: "move",
        //});

        this.manager = manager;
        this.cursors = new Object();
        this._enabled = false;


        this.initializeNetwork();
        this.addListeners();
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
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
                //this.tool.onMouseDown(this.spoofEvent(x, y), cid, false);
                break;
            case DrawEventType.MouseDrag:
                //this.tool.onMouseDrag(this.spoofEvent(x, y), cid, false);
                break;
            case DrawEventType.MouseUp:
                //this.tool.onMouseUp(this.spoofEvent(x, y), cid, false);
                break;
        }
    }

    public processLoadEvents(events: Array<DrawEvent>): void {
        for (var i = 0; i < events.length; i++) {
            this.processDrawEvent(events[i]);
        }
    }

    public onUserConnect(cid: string): void {
        console.log(format("user %s connected", cid));
    }

    public onUserDisconnect(cid: string): void {
        console.log(format("user %s disconnected", cid));
    }
}
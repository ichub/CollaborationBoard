declare var paper;

enum DrawEventType {
    MouseDown,
    MouseDrag,
    MouseUp
}

interface BoardClient {
    onDrawEvent(cid: string, type: DrawEventType, x: number, y: number);
    onMouseMove(cid: string, x: number, y: number);
}

interface BoardServer {
    onDrawEvent(type: DrawEventType, x: number, y: number);
    onMouseMove(x: number, y: number);
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

    private spoofEvent(x: number, y: number) {
        var result = new paper.ToolEvent();

        result.point = new paper.Point(x, y);
        result.tool = this.tool;
        return result;
    }


    private initializeNetwork() {
        this.manager.hub.client.onDrawEvent = (cid: string, type: DrawEventType, x: number, y: number) => {
            switch (type) {
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
        };

        this.manager.hub.client.onMouseMove = (cid: string, x: number, y: number) => {
            if (!this.cursors[cid]) {
                this.cursors[cid] = new Cursor();
            }

            this.cursors[cid].setPosition(x, y);
        };
    }

    private createTool() {
        var tool = new paper.Tool();

        this.userPaths.own = new paper.Path();

        tool.onMouseDown = (event: any, userId= this.userPaths.own, send = true) => {
            if (this.enabled) {
                var path = (this.userPaths[userId] = new paper.Path());

                path.strokeColor = 'black';
                path.add(event.point);

                if (send) {
                    this.sendDrawEvent(DrawEventType.MouseDown, event);
                }
            }
        };

        tool.onMouseDrag = (event: any, userId= this.userPaths.own, send = true) => {
            if (this.enabled) {
                var path = this.userPaths[userId];

                path.add(event.point);

                if (send) {
                    this.sendDrawEvent(DrawEventType.MouseDrag , event);
                }
            }
        };

        tool.onMouseUp = (event: any, userId= this.userPaths.own, send = true) => {
            if (this.enabled) {
                var path = this.userPaths[userId];

                path.simplify(10);

                if (send) {
                    this.sendDrawEvent(DrawEventType.MouseUp, event);
                }
            }
        };

        return tool;
    }

    private addListeners() {
        this.$canvas.mousemove(e => {
            this.sendMouseMove(e.clientX, e.clientY);
        });
    }

    private sendDrawEvent(type: DrawEventType, event: any) {
        this.manager.hub.server.onDrawEvent(type, event.point.x, event.point.y);
    }

    private sendMouseMove(x: number, y: number) {
        this.manager.hub.server.onMouseMove(x, y);
    }

    public onUserConnect(cid: string) {
        console.log(format("user %s connected", cid));
    }
}
declare var paper;

interface BoardClient {
    onMouseDown(cid: string, x: number, y: number);
    onMouseDrag(cid: string, x: number, y: number);
    onMouseUp(cid: string, x: number, y: number);
    onMouseMove(cid: string, x: number, y: number);
}

interface BoardServer {
    onMouseDown(x: number, y: number);
    onMouseDrag(x: number, y: number);
    onMouseUp(x: number, y: number);
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
        this.manager.hub.client.onMouseDown = (cid: string, x: number, y: number) => {
            this.tool.onMouseDown(this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };

        this.manager.hub.client.onMouseDrag = (cid: string, x: number, y: number) => {
            this.tool.onMouseDrag(this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };

        this.manager.hub.client.onMouseUp = (cid: string, x: number, y: number) => {
            this.tool.onMouseUp(this.spoofEvent(x, y), cid, false);
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
                    this.sendMouseDown(event);
                }
            }
        };

        tool.onMouseDrag = (event: any, userId= this.userPaths.own, send = true) => {
            if (this.enabled) {
                var path = this.userPaths[userId];

                path.add(event.point);

                if (send) {
                    this.sendMouseDrag(event);
                }
            }
        };

        tool.onMouseUp = (event: any, userId= this.userPaths.own, send = true) => {
            if (this.enabled) {
                var path = this.userPaths[userId];

                path.simplify(10);

                if (send) {
                    this.sendMouseUp(event);
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

    private sendMouseDown(event) {
        this.manager.hub.server.onMouseDown(event.point.x, event.point.y);
    }

    private sendMouseDrag(event) {
        this.manager.hub.server.onMouseDrag(event.point.x, event.point.y);
    }

    private sendMouseUp(event) {
        this.manager.hub.server.onMouseUp(event.point.x, event.point.y);
    }

    private sendMouseMove(x: number, y: number) {
        this.manager.hub.server.onMouseMove(x, y);
    }

    public onUserConnect(cid: string) {
        console.log(format("user %s connected", cid));
    }
}
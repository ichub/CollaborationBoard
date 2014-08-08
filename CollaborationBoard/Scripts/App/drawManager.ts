declare var paper;

interface BoardClient {
    onMouseDown(cid: string, x: number, y: number);
    onMouseDrag(cid: string, x: number, y: number);
    onMouseUp(cid: string, x: number, y: number);
}

interface BoardServer {
    onMouseDown(x: number, y: number);
    onMouseDrag(x: number, y: number);
    onMouseUp(x: number, y: number);
}

class DrawManager {
    $canvas: JQuery;
    manager: BoardManager;
    userPaths: any;
    tool: any;

    constructor(manager: BoardManager, canvasId: string) {
        this.manager = manager;
        this.$canvas = $("#" + canvasId);
        this.userPaths = new Object();

        paper.setup(canvasId);

        this.tool = this.createTool();

        this.initializeNetwork();
    }

    enableDrawing() {

    }

    spoofEvent(x: number, y: number) {
        var result = new paper.ToolEvent();

        result.point = new paper.Point(x, y);
        result.tool = this.tool;
        return result;
    }


    initializeNetwork() {
        this.manager.board.client.onMouseDown = (cid: string, x: number, y: number) => {
            this.tool.onMouseDown(this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };

        this.manager.board.client.onMouseDrag = (cid: string, x: number, y: number) => {
            this.tool.onMouseDrag(this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };

        this.manager.board.client.onMouseUp = (cid: string, x: number, y: number) => {
            this.tool.onMouseUp(this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };
    }

    createTool() {
        var tool = new paper.Tool();

        this.userPaths.own = new paper.Path();

        tool.onMouseDown = (event: any, userId= this.userPaths.own, send = true) => {
            var path = (this.userPaths[userId] = new paper.Path());

            path.strokeColor = 'black';
            path.add(event.point);

            if (send) {
                this.sendMouseDown(event);
            }
        };

        tool.onMouseDrag = (event: any, userId= this.userPaths.own, send = true) => {
            var path = this.userPaths[userId];

            path.add(event.point);

            if (send) {
                this.sendMouseDrag(event);
            }
        };

        tool.onMouseUp = (event: any, userId= this.userPaths.own, send = true) => {
            var path = this.userPaths[userId];

            path.simplify(10);

            if (send) {
                this.sendMouseUp(event);
            }
        };

        return tool;
    }

    sendMouseDown(event) {
        this.manager.board.server.onMouseDown(event.point.x, event.point.y);
    }

    sendMouseDrag(event) {
        this.manager.board.server.onMouseDrag(event.point.x, event.point.y);
    }

    sendMouseUp(event) {
        this.manager.board.server.onMouseUp(event.point.x, event.point.y);
    }


    onUserConnect(cid: string) {
        console.log(cid);
    }
}
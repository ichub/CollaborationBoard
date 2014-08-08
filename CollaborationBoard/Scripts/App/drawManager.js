var DrawManager = (function () {
    function DrawManager(manager, canvasId) {
        this.manager = manager;
        this.$canvas = $("#" + canvasId);
        this.userPaths = new Object();

        paper.setup(canvasId);

        this.tool = this.createTool();

        this.initializeNetwork();
    }
    DrawManager.prototype.enableDrawing = function () {
    };

    DrawManager.prototype.spoofEvent = function (x, y) {
        var result = new paper.ToolEvent();

        result.point = new paper.Point(x, y);
        result.tool = this.tool;
        return result;
    };

    DrawManager.prototype.initializeNetwork = function () {
        var _this = this;
        this.manager.board.client.onMouseDown = function (cid, x, y) {
            _this.tool.onMouseDown(_this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };

        this.manager.board.client.onMouseDrag = function (cid, x, y) {
            _this.tool.onMouseDrag(_this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };

        this.manager.board.client.onMouseUp = function (cid, x, y) {
            _this.tool.onMouseUp(_this.spoofEvent(x, y), cid, false);
            paper.view.draw();
        };
    };

    DrawManager.prototype.createTool = function () {
        var _this = this;
        var tool = new paper.Tool();

        this.userPaths.own = new paper.Path();

        tool.onMouseDown = function (event, userId, send) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof send === "undefined") { send = true; }
            var path = (_this.userPaths[userId] = new paper.Path());

            path.strokeColor = 'black';
            path.add(event.point);

            if (send) {
                _this.sendMouseDown(event);
            }
        };

        tool.onMouseDrag = function (event, userId, send) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof send === "undefined") { send = true; }
            var path = _this.userPaths[userId];

            path.add(event.point);

            if (send) {
                _this.sendMouseDrag(event);
            }
        };

        tool.onMouseUp = function (event, userId, send) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof send === "undefined") { send = true; }
            var path = _this.userPaths[userId];

            path.simplify(10);

            if (send) {
                _this.sendMouseUp(event);
            }
        };

        return tool;
    };

    DrawManager.prototype.sendMouseDown = function (event) {
        this.manager.board.server.onMouseDown(event.point.x, event.point.y);
    };

    DrawManager.prototype.sendMouseDrag = function (event) {
        this.manager.board.server.onMouseDrag(event.point.x, event.point.y);
    };

    DrawManager.prototype.sendMouseUp = function (event) {
        this.manager.board.server.onMouseUp(event.point.x, event.point.y);
    };

    DrawManager.prototype.onUserConnect = function (cid) {
        console.log(cid);
    };
    return DrawManager;
})();
//# sourceMappingURL=drawManager.js.map

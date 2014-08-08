var DrawManager = (function () {
    function DrawManager(manager, canvasId) {
        this.$canvas = $("#" + canvasId);
        this.manager = manager;
        this.cursors = new Object();
        this.userPaths = new Object();

        paper.setup(canvasId);
        this.tool = this.createTool();

        this.initializeNetwork();
        this.addListeners();
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

        this.manager.board.client.onMouseMove = function (cid, x, y) {
            if (!_this.cursors[cid]) {
                _this.cursors[cid] = new Cursor();
            }

            _this.cursors[cid].setPosition(x, y);
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

    DrawManager.prototype.addListeners = function () {
        var _this = this;
        this.$canvas.mousemove(function (e) {
            _this.sendMouseMove(e.clientX, e.clientY);
        });
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

    DrawManager.prototype.sendMouseMove = function (x, y) {
        this.manager.board.server.onMouseMove(x, y);
    };

    DrawManager.prototype.onUserConnect = function (cid) {
        console.log(format("user %s connected", cid));
    };
    return DrawManager;
})();
//# sourceMappingURL=drawManager.js.map

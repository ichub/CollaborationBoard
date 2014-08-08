var DrawEventType;
(function (DrawEventType) {
    DrawEventType[DrawEventType["MouseDown"] = 0] = "MouseDown";
    DrawEventType[DrawEventType["MouseDrag"] = 1] = "MouseDrag";
    DrawEventType[DrawEventType["MouseUp"] = 2] = "MouseUp";
})(DrawEventType || (DrawEventType = {}));

var DrawEvent = (function () {
    function DrawEvent(type, x, y, cid) {
        if (typeof cid === "undefined") { cid = undefined; }
        this.type = type;
        this.cid = cid;
        this.x = x;
        this.y = y;
    }
    return DrawEvent;
})();

var DrawManager = (function () {
    function DrawManager(manager, canvasId) {
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
    Object.defineProperty(DrawManager.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
        },
        enumerable: true,
        configurable: true
    });


    DrawManager.prototype.spoofEvent = function (x, y) {
        var result = new paper.ToolEvent();

        result.point = new paper.Point(x, y);
        result.tool = this.tool;
        return result;
    };

    DrawManager.prototype.initializeNetwork = function () {
        var _this = this;
        this.manager.hub.client.onDrawEvent = function (event) {
            var x = event.x;
            var y = event.y;
            var cid = event.cid;

            switch (event.type) {
                case 0 /* MouseDown */:
                    _this.tool.onMouseDown(_this.spoofEvent(x, y), cid, false);
                    break;
                case 1 /* MouseDrag */:
                    _this.tool.onMouseDrag(_this.spoofEvent(x, y), cid, false);
                    break;
                case 2 /* MouseUp */:
                    _this.tool.onMouseUp(_this.spoofEvent(x, y), cid, false);
                    break;
            }

            paper.view.draw();
        };

        this.manager.hub.client.onMouseMove = function (cid, x, y) {
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
            if (_this.enabled) {
                var path = (_this.userPaths[userId] = new paper.Path());

                path.strokeColor = 'black';
                path.add(event.point);

                if (send) {
                    _this.sendDrawEvent(0 /* MouseDown */, event);
                }
            }
        };

        tool.onMouseDrag = function (event, userId, send) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof send === "undefined") { send = true; }
            if (_this.enabled) {
                var path = _this.userPaths[userId];

                path.add(event.point);

                if (send) {
                    _this.sendDrawEvent(1 /* MouseDrag */, event);
                }
            }
        };

        tool.onMouseUp = function (event, userId, send) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof send === "undefined") { send = true; }
            if (_this.enabled) {
                var path = _this.userPaths[userId];

                path.simplify(10);

                if (send) {
                    _this.sendDrawEvent(2 /* MouseUp */, event);
                }
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

    DrawManager.prototype.sendDrawEvent = function (type, event) {
        this.manager.hub.server.onDrawEvent(new DrawEvent(type, event.point.x, event.point.y));
    };

    DrawManager.prototype.sendMouseMove = function (x, y) {
        this.manager.hub.server.onMouseMove(x, y);
    };

    DrawManager.prototype.onUserConnect = function (cid) {
        console.log(format("user %s connected", cid));
    };

    DrawManager.prototype.onUserDisconnect = function (cid) {
        console.log(format("user %s disconnected", cid));
    };
    return DrawManager;
})();
//# sourceMappingURL=drawManager.js.map

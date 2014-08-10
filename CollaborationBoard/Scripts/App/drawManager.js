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
        this.$container = this.$canvas.parent();

        //this.$canvas.draggable({
        //    cursor: "move",
        //});
        this.manager = manager;
        this.cursors = new Object();
        this.userPaths = new Object();
        this.enabled = false;
        this.canvasMargin = 100;

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
            _this.processDrawEvent(event);
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

        tool.onMouseDown = function (event, userId, isLocalChange) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof isLocalChange === "undefined") { isLocalChange = true; }
            if (_this.enabled) {
                var path = (_this.userPaths[userId] = new paper.Path());
                path.strokeWidth = 0;
                if (isLocalChange) {
                    path.strokeCap = "round";
                    path.strokeColor = "black";
                    path.fullySelected = true;
                }

                path.add(event.point);

                if (isLocalChange) {
                    _this.sendDrawEvent(0 /* MouseDown */, event);
                }
            }
        };

        tool.onMouseDrag = function (event, userId, isLocalChange) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof isLocalChange === "undefined") { isLocalChange = true; }
            if (_this.enabled) {
                var path = _this.userPaths[userId];

                path.add(event.point);

                if (isLocalChange) {
                    _this.sendDrawEvent(1 /* MouseDrag */, event);
                }
            }
        };

        tool.onMouseUp = function (event, userId, isLocalChange) {
            if (typeof userId === "undefined") { userId = _this.userPaths.own; }
            if (typeof isLocalChange === "undefined") { isLocalChange = true; }
            if (_this.enabled) {
                var path = _this.userPaths[userId];

                path.simplify(10);
                path.strokeWidth = 5;
                path.fullySelected = false;
                path.strokeColor = "black";
                path.strokeCap = "round";

                if (isLocalChange) {
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

    DrawManager.prototype.processDrawEvent = function (event) {
        var x = event.x;
        var y = event.y;
        var cid = event.cid;

        switch (event.type) {
            case 0 /* MouseDown */:
                this.tool.onMouseDown(this.spoofEvent(x, y), cid, false);
                break;
            case 1 /* MouseDrag */:
                this.tool.onMouseDrag(this.spoofEvent(x, y), cid, false);
                break;
            case 2 /* MouseUp */:
                this.tool.onMouseUp(this.spoofEvent(x, y), cid, false);
                break;
        }

        paper.view.draw();
    };

    DrawManager.prototype.processLoadEvents = function (events) {
        for (var i = 0; i < events.length; i++) {
            this.processDrawEvent(events[i]);
        }
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

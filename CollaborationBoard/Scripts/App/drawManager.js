var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
})();

var ManagerState;
(function (ManagerState) {
    ManagerState[ManagerState["Drawing"] = 0] = "Drawing";
    ManagerState[ManagerState["Dragging"] = 1] = "Dragging";
})(ManagerState || (ManagerState = {}));

var DrawManager = (function () {
    function DrawManager(manager, $canvas) {
        this.manager = manager;

        this.width = 800;
        this.height = 600;

        var canvas = $canvas.get(0);

        this.$canvas = $canvas;
        this.$parent = $canvas.parent();
        this.context = canvas.getContext("2d");

        this.ms = {
            pos: new Point(0, 0),
            lastPos: new Point(0, 0),
            down: false,
            initialized: false
        };

        this.drag = {
            x: 0,
            y: 0,
            mx: 0,
            my: 0
        };

        this.state = 0 /* Drawing */;

        this.$canvas.css({
            width: this.width,
            height: this.height
        });

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.initializeNetwork();
    }
    DrawManager.prototype.enable = function () {
        this.addListeners();
        this.resetDrawingSettings();
    };

    DrawManager.prototype.initializeNetwork = function () {
        var _this = this;
        this.manager.board.client.draw = function (cid, x1, y1, x2, y2) {
            if (cid != _this.manager.clientId) {
                _this.drawLine(new Point(x1, y1), new Point(x2, y2));
            }
        };
    };

    DrawManager.prototype.addListeners = function () {
        var _this = this;
        $(window).mousedown(function (e) {
            _this.updateMouseDown(e);

            if (_this.state == 1 /* Dragging */) {
                _this.onDragStart();
            } else {
                _this.onDrawStart();
            }
        });

        $(window).mouseup(function (e) {
            _this.updateMouseUp(e);

            if (_this.state == 1 /* Dragging */) {
                _this.onDragEnd();
            } else {
                _this.onDrawEnd();
            }
        });

        $(window).mousemove(function (e) {
            _this.updateMousePosition(e);

            if (_this.ms.down) {
                if (_this.state == 1 /* Dragging */) {
                    _this.onDrag();
                } else {
                    _this.onDraw();
                }
            }
        });
    };

    DrawManager.prototype.resetDrawingSettings = function () {
        this.context.strokeStyle = "#000";
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 10;
    };

    DrawManager.prototype.updateMouseDown = function (e) {
        if (e.button == 0) {
            this.ms.down = true;
        }
    };

    DrawManager.prototype.updateMouseUp = function (e) {
        if (e.button == 0) {
            this.ms.down = false;
        }
    };

    DrawManager.prototype.updateMousePosition = function (e) {
        var coords = this.$canvas.position();

        if (!this.ms.initialized) {
            this.ms.initialized = true;

            this.ms.pos.x = e.clientX - coords.left;
            this.ms.pos.y = e.clientY - coords.top;
            this.ms.lastPos.x = this.ms.pos.x;
            this.ms.lastPos.y = this.ms.pos.y;
        } else {
            this.ms.lastPos.x = this.ms.pos.x;
            this.ms.lastPos.y = this.ms.pos.y;
            this.ms.pos.x = e.clientX - coords.left;
            this.ms.pos.y = e.clientY - coords.top;
        }
    };

    DrawManager.prototype.onDrag = function () {
        var newX = this.ms.pos.x - this.drag.mx + this.drag.x;
        var newY = this.ms.pos.y - this.drag.mx + this.drag.y;

        this.$canvas.offset({
            top: newY,
            left: newX
        });
    };

    DrawManager.prototype.onDragStart = function () {
        var coords = this.$canvas.position();

        this.drag.x = coords.left;
        this.drag.y = coords.top;
        this.drag.mx = this.ms.pos.x;
        this.drag.my = this.ms.pos.y;
    };

    DrawManager.prototype.onDragEnd = function () {
    };

    DrawManager.prototype.onDraw = function () {
        this.drawLine(this.ms.pos, this.ms.lastPos);
        this.manager.sendServerDraw(this.ms.pos, this.ms.lastPos);
    };

    DrawManager.prototype.onDrawStart = function () {
    };

    DrawManager.prototype.onDrawEnd = function () {
    };

    DrawManager.prototype.drawLine = function (from, to) {
        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.stroke();
    };
    return DrawManager;
})();

onload = function () {
    var manager = new BoardManager();
};
//# sourceMappingURL=drawManager.js.map

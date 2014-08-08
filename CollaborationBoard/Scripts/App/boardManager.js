﻿var BoardManager = (function () {
    function BoardManager() {
        var _this = this;
        this.hub = $.connection.boardHub;
        this.draw = new DrawManager(this, "drawCanvas");

        this.hub.client.handshake = function (neighbors) {
            _this.draw.enabled = true;
        };

        this.hub.client.connect = function (cid) {
            _this.draw.onUserConnect(cid);
        };

        $.connection.hub.start().done(function () {
            _this.hub.server.handshake(boardId);
        });
    }
    return BoardManager;
})();

onload = function () {
    ExtendJQuery();
    var manager = new BoardManager();
};
//# sourceMappingURL=boardManager.js.map

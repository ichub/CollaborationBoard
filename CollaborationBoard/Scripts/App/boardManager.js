var BoardManager = (function () {
    function BoardManager() {
        var _this = this;
        this.hub = $.connection.boardHub;
        this.draw = new DrawManager(this, "drawCanvas");

        this.hub.client.handshake = function (neighbors, actions) {
            _this.draw.enabled = true;
            _this.draw.processLoadEvents(actions);
        };

        this.hub.client.connect = function (cid) {
            _this.draw.onUserConnect(cid);
        };

        this.hub.client.disconnect = function (cid) {
            _this.draw.onUserDisconnect(cid);
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

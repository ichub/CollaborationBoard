var BoardManager = (function () {
    function BoardManager() {
        var _this = this;
        this.board = $.connection.boardHub;
        this.draw = new DrawManager(this, "drawCanvas");

        this.board.client.handshake = function (neighbors) {
            _this.draw.enableDrawing();
        };

        this.board.client.connect = function (cid) {
            _this.draw.onUserConnect(cid);
        };

        $.connection.hub.start().done(function () {
            _this.board.server.handshake(boardId);
        });
    }
    return BoardManager;
})();

onload = function () {
    ExtendJQuery();
    var manager = new BoardManager();
};
//# sourceMappingURL=boardManager.js.map

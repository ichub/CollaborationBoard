var BoardManager = (function () {
    function BoardManager() {
        var _this = this;
        this.board = $.connection.boardHub;
        this.draw = new DrawManager(this, $("#drawCanvas"));

        this.board.client.handshake = function () {
            _this.draw.enable();
        };

        $.connection.hub.start().done(function () {
            _this.board.server.handshake(boardId);
        });
    }
    BoardManager.prototype.sendServerDraw = function (from, to) {
        this.board.server.draw(from.x, from.y, to.x, to.y);
    };
    return BoardManager;
})();

onload = function () {
    ExtendJQuery();
    var manager = new BoardManager();
};
//# sourceMappingURL=boardManager.js.map

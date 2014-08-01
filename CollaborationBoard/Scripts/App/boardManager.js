var BoardManager = (function () {
    function BoardManager() {
        var _this = this;
        this.board = $.connection.boardHub;
        this.draw = new DrawManager(this, $("#drawCanvas"));

        this.board.client.recieveId = function (cid) {
            _this.clientId = cid;

            _this.draw.enable();
        };

        $.connection.hub.start().done(function () {
            _this.board.server.registerId();
        });
    }
    BoardManager.prototype.sendServerDraw = function (from, to) {
        this.board.server.draw(from.x, from.y, to.x, to.y);
    };
    return BoardManager;
})();
//# sourceMappingURL=boardManager.js.map

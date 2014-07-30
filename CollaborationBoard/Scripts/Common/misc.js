(function () {
    "use strict";

    window.Collab = window.Collab || {};

    var format = function (nw) {
        var i = 0;
        while (/%s/.test(nw))
            nw = nw.replace('%s', arguments[++i])
        return nw;
    };

    var createBoard = function () {
        return $.ajax({
            url: "/board/new",
            type: "GET"
        });
    };

    var createBoardUrl = function (id) {
        return format("/board/%s", id);
    };

    window.Collab.CreateBoard = createBoard;
    window.Collab.CreateBoardUrl = createBoardUrl;
})();
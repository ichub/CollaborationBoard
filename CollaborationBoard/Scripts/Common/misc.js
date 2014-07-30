(function () {
    "use strict";

    window.Collab = window.Collab || {};

    window.format = function (nw) {
        var i = 0;
        while (/%s/.test(nw))
            nw = nw.replace('%s', arguments[++i])
        return nw;
    };

    Collab.CreateBoard = function () {
        return $.ajax({
            url: "/board/new",
            type: "GET"
        });
    };

    Collab.CreateBoardUrl = function (id) {
        return format("/board/%s", id);
    };

    $.fn.center = function () {
        var position = this.position();
        var width = this.innerWidth();
        var height = this.innerHeight();
        var parentWidth = this.parent().width();
        var parentHeight = this.parent().height();

        this.offset({
            left: parentWidth / 2 - width / 2,
            top: parentHeight / 2 - height / 2
        });
    };
})();
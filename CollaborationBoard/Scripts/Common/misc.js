var _this = this;
// usage: format("first: %s, second: %s, "first", "second");
var format = function (formatString) {
    var params = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        params[_i] = arguments[_i + 1];
    }
    var i = 0;

    while (/%s/.test(formatString)) {
        formatString = formatString.replace('%s', arguments[++i]);
    }
    return formatString;
};

Array.prototype.last = function () {
    return _this[_this.length - 1];
};

Array.prototype.first = function () {
    return _this[0];
};

var CreateBoard = function () {
    return $.ajax({
        url: "/board/new",
        type: "GET"
    });
};

var CreateBoardUrl = function (id) {
    return format("/board/%s", id);
};

var ExtendJQuery = function () {
    $.fn.center = function () {
        var position = this.position();
        var width = this.innerWidth();
        var height = this.innerHeight();
        var parentWidth = this.parent().width();
        var parentHeight = this.parent().height();

        this.css({
            left: Math.round(parentWidth / 2 - width / 2) + "px",
            top: Math.round(parentHeight / 2 - height / 2) + "px"
        });

        return this;
    };
};
//# sourceMappingURL=misc.js.map

interface Array<T> {
    first(): T;
    last(): T;
}

// usage: format("first: %s, second: %s, "first", "second");
var format = (formatString, ...params: any[]): string => {
    var i = 0;

    while (/%s/.test(formatString)) {
        formatString = formatString.replace('%s', arguments[++i])

    }
    return formatString;
};

Array.prototype.last = () => {
    return this[this.length - 1];
};

Array.prototype.first = () => {
    return this[0];
};

var CreateBoard = (): JQueryXHR => {
    return $.ajax({
        url: "/board/new",
        type: "GET"
    });
};

var CreateBoardUrl = (id: string) => {
    return format("/board/%s", id);
};

var ExtendJQuery = () => {
    $.fn.center = function() {
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
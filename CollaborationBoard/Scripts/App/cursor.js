var Cursor = (function () {
    function Cursor(color) {
        if (typeof color === "undefined") { color = "#000000"; }
        this.color = color;

        this.element = $("<div></div>").addClass("cursorContainer");

        var cursor = $("<icon></icon>").addClass("cursor fa fa-circle-o").css({ color: color });

        this.element.append(cursor);

        $(document.body).append(this.element);
    }
    Cursor.prototype.setPosition = function (x, y) {
        this.element.offset({
            top: y,
            left: x
        });
    };
    return Cursor;
})();
//# sourceMappingURL=cursor.js.map

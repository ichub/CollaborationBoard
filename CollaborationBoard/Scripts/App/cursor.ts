class Cursor {
    private color: string;
    private element: JQuery;

    constructor(color = "#000000") {
        this.color = color;

        this.element = $("<div></div>").addClass("cursorContainer");

        var cursor = $("<icon></icon>").addClass("cursor fa fa-circle-o").css({ color: color });

        this.element.append(cursor);

        $(document.body).append(this.element);
    }

    setPosition(x: number, y: number) {
        this.element.offset({
            top: y,
            left: x
        });
    }
}
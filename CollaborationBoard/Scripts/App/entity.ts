class Entity {
    private $element: JQuery;

    constructor($element: JQuery) {
        this.$element = $element;
        this.$element.addClass("entity");

        this.$element.draggable({
            containment: "#container"
        });
    }

    public setPosition(position: Point) {
        this.$element.offset(position.asOffset());
    }
} 
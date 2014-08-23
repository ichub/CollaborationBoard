class Entity {
    private $element: JQuery;
    private $container: JQuery;

    constructor($element: JQuery) {
        this.$container = $(document.createElement("div"));
        this.$element = $element;
        this.$element.addClass("entity");

        this.$container.addClass("entityContainer");

        this.$container.append(this.$element);
        $(document.body).append(this.$container);

        this.$container.draggable({
            containment: "#container"
        });
    }

    public setPosition(position: Point) {
        this.$container.offset(position.asOffset());
    }
} 
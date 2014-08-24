class Entity {
    private canvas: Canvas;
    private $element: JQuery;
    private $container: JQuery;
    private _id: string;

    constructor(canvas: Canvas, $element: JQuery, id: string) {
        this._id = id;
        this.canvas = canvas;
        this.$container = $(document.createElement("div"));
        this.$element = $element;
        this.$element.addClass("entity");

        this.$container.addClass("entityContainer");
        this.$container.attr("id", this._id);

        this.$container.append(this.$element);
        $(document.body).append(this.$container);

        this.$container.draggable({
            containment: "#container",
            drag: this.onDrag
        });
    }

    public get id() {
        return this._id;
    }

    public setPosition(position: Point): void {
        this.$container.offset(position.asOffset());
    }

    public onDrag(event: JQueryEventObject, ui: any): void {
    }
} 
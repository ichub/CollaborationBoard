class Entity {
    public $element: JQuery;

    private canvas: Canvas;
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
            drag: (event: JQueryEventObject, ui: any) => {
                this.onDrag(event, ui);
            }
        });
    }

    public get id() {
        return this._id;
    }

    public getSerializable(): any {
        return {
            id: this._id,
            position: this.position,
        };
    }

    public set position(position: Point) {
        this.$container.offset(position.asOffset());
    }

    public get position(): Point {
        var offset = this.$container.offset();

        return new Point(offset.left, offset.top);
    }

    public onDrag(event: JQueryEventObject, ui: any): void {
        this.canvas.app.hub.server.textEntityMove(this.id, Point.fromOffset(ui.offset));
    }
} 
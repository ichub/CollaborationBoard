class Entity {
    private _$element: JQuery;
    private _canvas: Canvas;
    private $container: JQuery;
    private _id: string;

    constructor(canvas: Canvas, $element: JQuery, id: string) {
        this._id = id;
        this._canvas = canvas;
        this.$container = $(document.createElement("div"));
        this._$element = $element;
        this._$element.addClass("entity");

        this.$container.addClass("entityContainer");
        this.$container.attr("id", this._id);

        this.$container.append(this._$element);
        $(document.body).append(this.$container);

        this.$container.draggable({
            containment: "#container",
            drag: (event: JQueryEventObject, ui: any) => {
                this.onDrag(event, ui);
            }
        });

        this.addListeners();
    }

    public addListeners() {

    }

    public get id() {
        return this._id;
    }

    public serialize(): any {
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
        this._canvas.app.hub.server.entityMove(this.id, Point.fromOffset(ui.offset));
    }

    public get $element() {
        return this._$element;
    }

    public get canvas() {
        return this._canvas;
    }
} 
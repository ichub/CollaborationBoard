class TextEntity extends Entity {
    constructor(canvas: Canvas, id: string, text: string, position: Point) {
        var textElement = document.createElement("input");
        textElement.classList.add("entityText");

        super(canvas, $(textElement), id);

        this.text = text;
        this.position = position;
    }

    public serialize(): any {
        var ser = super.serialize();

        (<any> ser).text = this.text;

        return ser;
    }

    public addListeners(): void {
        super.addListeners();

        this.$element.on("keyup", (event: JQueryEventObject) => {
            this.canvas.app.hub.server.textEntityUpdateText(this.id, this.text);
        });
    }

    public get text() {
        return this.$element.val();
    }

    public set text(text: string) {
        this.$element.val(text);
    }
} 
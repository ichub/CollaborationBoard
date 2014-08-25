class TextEntity extends Entity {
    constructor(canvas: Canvas, id: string) {
        var text = document.createElement("input");
        text.classList.add("entityText");

        super(canvas, $(text), id);
    }

    public getSerializable(): any {
        var ser = super.getSerializable();

        ser.text = this.text;

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
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

    public get text() {
        return this.$element.text();
    }
} 
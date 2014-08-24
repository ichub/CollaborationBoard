class EntityText extends Entity {
    constructor(canvas: Canvas, id: string) {
        var text = document.createElement("input");
        text.classList.add("entityText");

        super(canvas, $(text), id);
    }

    public onDrag(event: JQueryEventObject, ui: any): void {
        console.log(this.id + " " + event.clientX + " " + event.clientY);
    }
} 
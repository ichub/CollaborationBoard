class EntityCollection {
    private entityTexts: Array<EntityText>;
    private canvas: Canvas;
    private static entityCount = 0;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.entityTexts = [];
    }

    private generateId(): string {
        return this.canvas.app.cid.replace(/\-/g, "_") + "__" + (EntityCollection.entityCount++);
    }

    public addTextEntity(id = this.generateId()) {
        this.entityTexts.push(new EntityText(this.canvas, id));
    }
} 
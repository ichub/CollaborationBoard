interface BoardClient {
    addTextEntity(entity: EntityText);
}

interface BoardServer {
    addTextEntity(entity: EntityText);
}

class EntityCollection {
    private entityTexts: Array<EntityText>;
    private canvas: Canvas;
    private static entityCount = 0;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.entityTexts = [];
    }

    private initializeNetwork(): void {
        this.canvas.app.hub.client.addTextEntity = (entity: Entity) => {
            this.addTextEntity(entity.id);
        };
    }

    private generateId(): string {
        return this.canvas.app.cid.replace(/\-/g, "_") + "__" + (EntityCollection.entityCount++);
    }

    public addTextEntity(id = this.generateId()) {
        var newEntity = new EntityText(this.canvas, id);

        this.entityTexts.push(newEntity);

        this.canvas.app.hub.server.addTextEntity(newEntity.getSerializable());
    }
} 
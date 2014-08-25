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

        this.initializeNetwork();
    }

    private initializeNetwork(): void {
        this.canvas.app.hub.client.addTextEntity = (entity: Entity) => {
            this.addTextEntityWithoutSync(entity.id);
        };
    }

    private generateId(): string {
        return this.canvas.app.cid.replace(/\-/g, "_") + "__" + (EntityCollection.entityCount++);
    }

    private addTextEntityWithoutSync(id: string) : EntityText{
        var newEntity = new EntityText(this.canvas, id);

        this.entityTexts.push(newEntity);

        return newEntity;
    }

    public addTextEntity(id = this.generateId()) {
        var entity = this.addTextEntityWithoutSync(id);

        this.canvas.app.hub.server.addTextEntity(entity.getSerializable());
    }
} 
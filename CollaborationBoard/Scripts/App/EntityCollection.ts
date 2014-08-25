interface BoardClient {
    addTextEntity(entity: TextEntity);
}

interface BoardServer {
    addTextEntity(entity: TextEntity);
}

class EntityCollection {
    private entityTexts: Array<TextEntity>;
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

    private addTextEntityWithoutSync(id: string) : TextEntity{
        var newEntity = new TextEntity(this.canvas, id);

        this.entityTexts.push(newEntity);

        return newEntity;
    }

    public addTextEntity(id = this.generateId()) {
        var entity = this.addTextEntityWithoutSync(id);

        this.canvas.app.hub.server.addTextEntity(entity.getSerializable());
    }
} 
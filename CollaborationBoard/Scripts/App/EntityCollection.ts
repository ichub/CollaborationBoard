interface BoardClient {
    addTextEntity(entity: TextEntity);
    textEntityMove(id: string, to: Point);
}

interface BoardServer {
    addTextEntity(entity: TextEntity);
    textEntityMove(id: string, to: Point);
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
        this.canvas.app.hub.client.addTextEntity = (entity: Entity): void=> {
            this.addTextEntityWithoutSync(entity.id);
        };

        this.canvas.app.hub.client.textEntityMove = (id: string, to: Point): void => {
            var matching = this.entityTexts.filter((val, index) => {
                return val.id == id;
            })

            if (matching.length == 1) {
                matching[0].position = Point.clone(to);
            }
        };
    }

    private generateId(): string {
        return this.canvas.app.cid.replace(/\-/g, "_") + "__" + (EntityCollection.entityCount++);
    }

    private addTextEntityWithoutSync(id: string): TextEntity {
        var newEntity = new TextEntity(this.canvas, id);

        this.entityTexts.push(newEntity);

        return newEntity;
    }

    public addTextEntity(id = this.generateId()) {
        var entity = this.addTextEntityWithoutSync(id);

        this.canvas.app.hub.server.addTextEntity(entity.getSerializable());
    }
} 
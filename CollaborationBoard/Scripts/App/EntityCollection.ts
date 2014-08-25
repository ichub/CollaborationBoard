interface BoardClient {
    addTextEntity(entity: TextEntity);
    textEntityMove(id: string, to: Point);
    textEntityUpdateText(id: string, text: string);
}

interface BoardServer {
    addTextEntity(entity: TextEntity);
    textEntityMove(id: string, to: Point);
    textEntityUpdateText(id: string, text: string);
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
            this.getEntity<TextEntity>(id).position = Point.clone(to);
        };

        this.canvas.app.hub.client.textEntityUpdateText = (id: string, text: string): void => {
            this.getEntity<TextEntity>(id).text = text;
        };
    }

    private getEntity<T>(id: String): T {
        return <T> <any> (this.entityTexts.filter((val, index) => {
            return val.id == id;
        })[0]);
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
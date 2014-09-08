interface BoardClient {
    addTextEntity(entity: TextEntity);
    textEntityUpdateText(id: string, text: string);
    entityMove(id: string, to: Point);
}

interface BoardServer {
    addTextEntity(entity: TextEntity);
    textEntityUpdateText(id: string, text: string);
    entityMove(id: string, to: Point);
}

enum EntityType {
    Text
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
        this.canvas.app.hub.client.addTextEntity = (entity: TextEntity): void=> {
            this.addTextEntityWithoutSync(entity.id, entity.text, Point.deserialize(entity.position));
        };

        this.canvas.app.hub.client.entityMove = (id: string, to: Point): void => {
            this.getEntity<TextEntity>(id).position = Point.deserialize(to);
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

    private generateId(type: EntityType): string {
        return this.canvas.app.user.id.replace(/\-/g, "_") + "__" + (EntityCollection.entityCount++) + "__" + type.toString();
    }

    private addTextEntityWithoutSync(id: string, text: string, position: Point): TextEntity {
        var newEntity = new TextEntity(this.canvas, id, text, position);

        this.entityTexts.push(newEntity);

        return newEntity;
    }

    public addTextEntity(id = this.generateId(EntityType.Text), text = "", position = new Point(0, 0)): void {
        var entity = this.addTextEntityWithoutSync(id, text, position);

        this.canvas.app.hub.server.addTextEntity(entity.serialize());
    }
} 
class EntityCollection {
    private entityTexts: Array<EntityText>;

    constructor() {
        this.entityTexts = [];
    }

    addTextEntity(entity: EntityText) {
        this.entityTexts.push(entity);
    }
} 
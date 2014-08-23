class EntityText extends Entity {
    constructor() {
        var text = document.createElement("input");
        text.classList.add("entityText");

        super($(text));
    }

    private addListeners() {

    }
} 
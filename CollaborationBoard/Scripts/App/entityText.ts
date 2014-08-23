class EntityText extends Entity {
    constructor() {
        var text = document.createElement("input");

        text.setAttribute("disabled", "disabled");
        super($(text));
    }

    private addListeners() {

    }
} 
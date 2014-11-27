class ToolBox {
    public app: Application;
    public $toolBox: JQuery;
    public $eraser: JQuery;

    constructor(app: Application) {
        this.app = app;
        this.$toolBox = $("#toolbox");
        this.$eraser = $("#eraser");

        this.addListeners();
    }

    public addListeners(): void {
        this.$eraser.click(() => { this.setEraseTool(true); });
    }

    private deselectAllTools(): void {
        var children = this.$eraser.children();

        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove("selected");
        }
    }

    public setEraseTool(updateServer: boolean): void {
        this.$eraser.addClass("selected");
        this.app.canvas.userTool.behavior = new EraseBehavior(this.app.canvas.userTool);

        if (updateServer) {
            this.app.hub.server.onToolChange("erase");
        }
    }

    public setDrawTool(updateServer: boolean): void {
        this.app.canvas.userTool.behavior = new DrawBehavior(this.app.canvas.userTool);

        if (updateServer) {
            this.app.hub.server.onToolChange("draw");
        }
    }

    public setTool(toolName: string, updateServer: boolean): void {
        switch (toolName) {
            case "erase":
                this.setEraseTool(updateServer);
                break;
            case "draw":
                this.setDrawTool(updateServer);
                break;
        }
    }
}
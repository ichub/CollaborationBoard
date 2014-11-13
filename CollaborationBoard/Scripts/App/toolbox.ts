class ToolBox {
    private app: Application;
    private $toolBox: JQuery;
    private $eraser: JQuery;

    constructor(app: Application) {
        this.app = app;
        this.$toolBox = $("#toolbox");
        this.$eraser = $("#eraser");

        this.addListeners();
    }

    public addListeners(): void {
        this.$eraser.click(e => {
            this.app.canvas.userTool.behavior = new EraseBehavior(this.app.canvas.userTool);
            this.$eraser.addClass("selected");
        });
    }
}
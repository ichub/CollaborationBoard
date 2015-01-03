class ToolBox {
    public app: Application;
    public $toolBox: JQuery;
    public $eraser: JQuery;
    public $drawer: JQuery;
    public $colors: JQuery;
    public $thickness: JQuery;
    public currentColor: string;

    private colors = [
        "#E35252",
        "#E352B5",
        "#D252E3",
        "#A252E3",
        "#7852E3",
        "#5752E3",
        "#5274E3",
        "#5291E3",
        "#52CBE3",
        "#52E3DC",
        "#52E3AE",
        "#52E36C",
        "#9DE352",
        "#C3E352",
        "#E3D252",
        "#E3A652",
        "#E36552",
        "#E83535",
        "#961E1E",
        "#961E7A",
        "#521E96",
        "#1E4296",
        "#FFFFFF",
        "#9C9C9C",
        "#000000",
    ];

    constructor(app: Application) {
        this.app = app;

        this.currentColor = "black";

        this.$toolBox = $("#toolbox");
        this.$eraser = $("#eraser");
        this.$drawer = $("#drawer");
        this.$colors = $("#colors");
        this.$thickness = $("#thickness");

        this.addListeners();

        this.createColors();
    }

    public createColors() {
        var $colorPicker = $("#colorPicker");

        $colorPicker.offset({
            left: this.$colors.offset().left,
            top: this.$colors.offset().top + this.$colors.height() + 2
        });

        for (var i = 0; i < this.colors.length; i++) {
            var color = document.createElement("div");
            color.classList.add("color");
            color.style.backgroundColor = this.colors[i];

            $colorPicker.append(color);

            this.addColorPickerListener(color, this.colors[i]);
        }
    }

    private addColorPickerListener(element: HTMLDivElement, color: string) {
        $(element).click(() => {
            this.currentColor = color;

            if (this.app.canvas.userTool.behavior.name != "erase") {
                this.app.canvas.userTool.behavior.color = color;
            }

            this.app.canvas.userTool.applyStyles(this.app.canvas.userTool.bufferContext);
        });
    }

    public addListeners(): void {
        this.$eraser.click(() => { this.setEraseTool(true); });
        this.$drawer.click(() => { this.setDrawTool(true); });

        this.$colors.click(() => { this.toggleColorPicker(); });
        this.$thickness.click(() => { this.toggleThicknessPicker(); });
    }

    private toggleColorPicker() {
        this.$colors.toggleClass("selected");
        $("#colorPicker").toggleClass("hidden");
    }

    private toggleThicknessPicker() {
        this.$thickness.toggleClass("selected");
        $("#thicknessPicker").toggleClass("hidden");
    }

    private deselectAllTools(): void {
        var children = this.$toolBox.children();

        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove("selected");
        }
    }

    public setEraseTool(updateServer: boolean): void {
        this.deselectAllTools();

        this.$eraser.addClass("selected");
        this.app.canvas.userTool.setBehavior(new EraseBehavior(this.app.canvas.userTool));

        if (updateServer) {
            this.app.hub.server.onToolChange("erase");
        }
    }

    public setDrawTool(updateServer: boolean): void {
        this.deselectAllTools();

        this.$drawer.addClass("selected");
        this.app.canvas.userTool.setBehavior(new DrawBehavior(this.app.canvas.userTool));

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
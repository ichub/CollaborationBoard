class ToolBox {
    public app: Application;
    public $optionsBlind: JQuery;
    public $toolBox: JQuery;
    public $eraser: JQuery;
    public $drawer: JQuery;
    public $colors: JQuery;
    public $thicknessToggle: JQuery;
    public $thicknessValue: JQuery;
    public $thicknessSlider: JQuery;
    public $clear: JQuery;

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

        this.$optionsBlind = $("#optionsBlind");
        this.$toolBox = $("#toolbox");
        this.$eraser = $("#eraser");
        this.$drawer = $("#drawer");
        this.$colors = $("#colors");
        this.$thicknessToggle = $("#thickness");
        this.$clear = $("#clear");
        this.$thicknessValue = $("#thicknessValue");
        this.$thicknessSlider = $("#thicknessSlider");
        this.createColors();
        this.createSizeSlider();

        this.$eraser.click(() => { this.setEraseTool(true); });
        this.$drawer.click(() => { this.setDrawTool(true); });

        this.$colors.click(() => { this.toggleColorPicker(); });
        this.$thicknessToggle.click(() => { this.toggleThicknessPicker(); });
        this.$clear.click(() => { this.clear(); });
        this.$optionsBlind.click(() => { this.onBlindClick() });

        this.$thicknessSlider.on("input",(e) => { this.onThicknessChange(e); });
    }

    public createColors(): void {
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

    public hideAllOptionsWindows(): void {
        this.$colors.removeClass("selected");
        $("#colorPicker").addClass("hidden");

        this.$thicknessToggle.removeClass("selected");
        $("#thicknessPicker").addClass("hidden");
    }

    public onBlindClick(): void {
        this.hideAllOptionsWindows();
        this.$optionsBlind.css("visibility", "hidden");
    }

    public showOptionsBlind(): void {
        this.$optionsBlind.css("visibility", "initial");
    }

    public createSizeSlider(): void {
        var $size = $("#thicknessPicker");

        $size.offset({
            left: this.$thicknessToggle.offset().left,
            top: this.$thicknessToggle.offset().top + this.$thicknessToggle.height() + 2
        });
    }

    public onThicknessChange(e: JQueryEventObject): void {
        var value = e.target["valueAsNumber"];

        this.$thicknessValue.text(e.target["valueAsNumber"]);

        this.app.canvas.userTool.behavior.thickness = value;
        this.app.canvas.userTool.applyStyles(this.app.canvas.userTool.bufferContext);
    }

    public setThicknessDisplay(value: number): void {
        this.$thicknessValue.text(value);
        this.$thicknessSlider.val(value.toString());
    }

    private addColorPickerListener(element: HTMLDivElement, color: string): void {
        $(element).click(() => {
            this.currentColor = color;

            if (this.app.canvas.userTool.behavior.name != "erase") {
                this.app.canvas.userTool.behavior.color = color;
            }

            this.app.canvas.userTool.applyStyles(this.app.canvas.userTool.bufferContext);
        });
    }

    private clear() {
        this.app.hub.server.onClear();
        this.app.canvas.clear();
    }

    private toggleColorPicker(): void {
        this.$colors.toggleClass("selected");
        $("#colorPicker").toggleClass("hidden");

        this.showOptionsBlind();
    }

    private toggleThicknessPicker(): void {
        this.$thicknessToggle.toggleClass("selected");
        $("#thicknessPicker").toggleClass("hidden");

        this.showOptionsBlind();
    }

    private deselectAllTools(): void {
        var children = this.$toolBox.find("#tools").children();

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

        this.setThicknessDisplay(this.app.canvas.userTool.behavior.thickness);
    }

    public setDrawTool(updateServer: boolean): void {
        this.deselectAllTools();

        this.$drawer.addClass("selected");
        this.app.canvas.userTool.setBehavior(new DrawBehavior(this.app.canvas.userTool));

        if (updateServer) {
            this.app.hub.server.onToolChange("draw");
        }

        this.setThicknessDisplay(this.app.canvas.userTool.behavior.thickness);
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
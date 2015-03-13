interface ToolBehavior {
    name: string;
    color: string;
    thickness: number;
    styles: Object;
    bufferContext: CanvasRenderingContext2D;
    finalContext: CanvasRenderingContext2D;

    onMouseDown(event: DrawEvent): void;
    onMouseUp(event: DrawEvent): void;
    onMouseDrag(event: DrawEvent): void;
    finalize(path: Array<Point>): void;
}
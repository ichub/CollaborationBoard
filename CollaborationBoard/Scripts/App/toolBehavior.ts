interface ToolBehavior {
    bufferContext: CanvasRenderingContext2D;
    finalContext: CanvasRenderingContext2D;

    onMouseDown(event: DrawEvent);
    onMouseUp(event: DrawEvent);
    onMouseDrag(event: DrawEvent);
    finalize(path: Array<Point>);
}
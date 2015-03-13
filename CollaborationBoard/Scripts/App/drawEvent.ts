class DrawEvent {
    public type: DrawEventType;
    public id: string;
    public point: Point;
    public lastPoint: Point;
    public toolBehaviorName: string;
    public color: string;
    public thickness: number;
    public isDragging: boolean;

    constructor(type: DrawEventType, point: Point, lastPoint: Point, toolBehaviorName: string, color: string, thickness: number) {
        this.type = type;
        this.point = point.round();
        this.lastPoint = lastPoint.round();
        this.id = "";
        this.toolBehaviorName = toolBehaviorName;
        this.color = color;
        this.thickness = thickness;
    }
} 
class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static deserialize(serialized: any): Point {
        return new Point(serialized.x, serialized.y);
    }

    public static fromOffset(offset: JQueryCoordinates): Point {
        return new Point(offset.left, offset.top);
    }

    public round(): Point {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    }

    public asOffset(): JQueryCoordinates {
        return {
            top: this.y,
            left: this.x
        };
    }
} 
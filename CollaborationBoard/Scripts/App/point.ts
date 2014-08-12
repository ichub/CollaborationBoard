class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public round(): Point {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    }
} 
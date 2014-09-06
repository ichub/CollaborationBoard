class Message {
    private _text: string;
    private _sender: string;
    private _color: string;

    constructor(text: string, sender: string, color: string) {
        this._text = text;
        this._sender = sender;
        this._color = color;
    }

    public get text() {
        return this._text;
    }

    public get sender() {
        return this._sender;
    }

    public get color() {
        return this._color;
    }

    public serialize(): any {
        return {
            text: this._text,
            sender: this._sender,
            color: this._color
        };
    }

    public static deserialize(serialized: any): Message {
        return new Message(serialized.text, serialized.sender, serialized.color);
    }
}
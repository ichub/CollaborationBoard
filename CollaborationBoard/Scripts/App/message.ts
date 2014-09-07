class Message {
    private _text: string;
    private _senderName: string;
    private _sender: string;
    private _color: string;

    constructor(text: string, senderName: string, color: string) {
        this._text = text;
        this._senderName = senderName;
        this._color = color;
    }

    public get text() {
        return this._text;
    }

    public get senderName() {
        return this._senderName;
    }

    public get sender() {
        return this._senderName;
    }

    public get color() {
        return this._color;
    }

    public serialize(): any {
        return {
            text: this._text,
            snder: this._sender,
            senderName: this._senderName,
            color: this._color
        };
    }

    public static deserialize(serialized: any): Message {
        return new Message(serialized.text, serialized.sender, serialized.color);
    }
}
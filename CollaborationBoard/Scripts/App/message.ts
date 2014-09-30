class Message {
    private _text: string;
    private _senderName: string;
    private _sender: string;
    private _color: string;
    private _dateSent: string;

    constructor(text: string, sender: string, senderName: string, color: string, dateSent: string) {
        this._text = text;
        this._senderName = senderName;
        this._color = color;
        this._dateSent = dateSent;
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

    public get dateSent() {
        return this._dateSent;
    }

    public serialize(): any {
        return {
            text: this._text,
            sender: this._sender,
            senderName: this._senderName,
            color: this._color
        };
    }

    public static deserialize(serialized: any): Message {
        return new Message(serialized.text, serialized.sender, serialized.senderName, serialized.color, serialized.dateSent);
    }
}
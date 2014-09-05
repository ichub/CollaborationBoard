class Message {
    private _text: string;
    private _sender: string;

    constructor(text: string, sender: string) {
        this._text = text;
        this._sender = sender;
    }

    public get text() {
        return this._text;
    }

    public get sender() {
        return this._sender;
    }

    public serialize(): any {
        return {
            text: this._text,
            sender: this._sender
        };
    }

    public static deserialize(serialized: any): Message {
        return new Message(serialized.text, serialized.sender);
    }
}
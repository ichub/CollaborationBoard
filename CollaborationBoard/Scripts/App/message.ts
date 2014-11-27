class Message {
    public text: string;
    public senderName: string;
    public sender: string;
    public color: string;
    public dateSent: string;

    constructor(text: string, sender: string, senderName: string, color: string, dateSent: string) {
        this.text = text;
        this.sender = sender;
        this.senderName = senderName;
        this.color = color;
        this.dateSent = dateSent;
    }

    public serialize(): any {
        return {
            text: this.text,
            sender: this.sender,
            senderName: this.senderName,
            color: this.color
        };
    }

    public static deserialize(serialized: any): Message {
        return new Message(serialized.text, serialized.sender, serialized.senderName, serialized.color, serialized.dateSent);
    }
}
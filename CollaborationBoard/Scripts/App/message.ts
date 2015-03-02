interface ISerializedMessage {
    text: string;
    sender: string;
    senderName: string;
}

class Message {
    public text: string;
    public senderName: string;
    public sender: string;
    public dateSent: string;

    constructor(text: string, sender: string, senderName: string, dateSent: string) {
        this.text = text;
        this.sender = sender;
        this.senderName = senderName;
        this.dateSent = dateSent;
    }

    public serialize(): ISerializedMessage {
        return {
            text: this.text,
            sender: this.sender,
            senderName: this.senderName
        };
    }

    public static deserialize(serialized: any): Message {
        return new Message(serialized.text, serialized.sender, serialized.senderName, serialized.dateSent);
    }
}
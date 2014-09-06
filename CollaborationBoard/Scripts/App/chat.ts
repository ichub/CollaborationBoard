interface BoardClient {
    addMessage(message: Message);
}

interface BoardServer {
    addMessage(message: Message);
}

class Chat {
    private $messageContainer: JQuery;
    private $messageInput: JQuery;
    private displayColor: string;
    private displayName: string;

    private app: Application;

    constructor(app: Application) {
        this.app = app;

        this.$messageContainer = $("#messageContainer");
        this.$messageInput = $("#messageInput");

        this.inititalizeNetwork();
        this.addListeners();
    }

    private inititalizeNetwork() {
        this.app.hub.client.addMessage = (message: Message) => {
            message = Message.deserialize(message);

            this.appendChatMessage(message);
        };
    }

    private addListeners() {
        this.$messageInput.keydown(e => {
            if (e.keyCode == 13) {
                var text = this.$messageInput.val();
                this.$messageInput.val("");

                var newMessage = new Message(text, this.displayName, this.displayColor);

                this.appendChatMessage(newMessage);

                this.app.hub.server.addMessage(newMessage.serialize());
            }
        });
    }

    private appendChatMessage(message: Message) {
        var element = document.createElement("div");

        var header = document.createElement("div");
        var footer = document.createElement("div");
        var content = document.createElement("div");

        header.classList.add("messageHeader");
        footer.classList.add("messageFooter");
        content.classList.add("messageContent");

        element.classList.add("message");

        header.innerText = message.sender;
        content.innerText = message.text;

        element.appendChild(header);
        element.appendChild(content);
        element.appendChild(footer);

        $(header).css("background-color", message.color);

        this.$messageContainer.append(element);
    }

    public initializeFromSnapshot(snapshot: BoardSnapshot) {
        this.displayColor = snapshot.displayColor;
        this.displayName = snapshot.displayName;

        snapshot.messages.forEach(message => {
            message = Message.deserialize(message);

            this.appendChatMessage(message);
        });
    }
} 
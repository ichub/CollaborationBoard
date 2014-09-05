interface BoardClient {
    addMessage(message: Message);
}

interface BoardServer {
    addMessage(message: Message);
}

class Chat {
    private $messageContainer: JQuery;
    private $messageInput: JQuery;

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

                var newMessage = new Message(text, this.app.cid);

                this.appendChatMessage(newMessage);

                this.app.hub.server.addMessage(newMessage.serialize());
            }
        });
    }

    private appendChatMessage(message: Message) {
        var element = document.createElement("div");

        element.classList.add("message");

        element.innerText = message.sender + " :: " + message.text;

        this.$messageContainer.append(element);
    }

    public initializeFromSnapshot(snapshot: BoardSnapshot) {
        snapshot.messages.forEach(message => {
            message = Message.deserialize(message);

            this.appendChatMessage(message);
        });

    }
} 
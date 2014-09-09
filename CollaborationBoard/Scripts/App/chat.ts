interface BoardClient {
    addMessage(message: Message);
}

interface BoardServer {
    addMessage(message: Message);
}

enum NotificationType {
    Error,
    Warning,
    Info
}

class Chat {
    public enabled: boolean;

    private $messageContainer: JQuery;
    private $messageInput: JQuery;

    private previousMessage: Message;

    private app: Application;

    constructor(app: Application) {
        this.app = app;

        this.enabled = false;

        this.$messageContainer = $(".messageContainer");
        this.$messageInput = $(".input");

        this.previousMessage = null;

        this.inititalizeNetwork();
        this.addListeners();
    }

    private inititalizeNetwork() {
        this.app.hub.client.addMessage = (message: Message) => {
            message = Message.deserialize(message);

            this.appendChatMessage(message);
        };
    }

    private scrollDown() {
        this.$messageContainer.prop("scrollTop", this.$messageContainer.prop("scrollHeight"));
    }

    private addListeners() {
        this.$messageInput.keydown(e => {
            if (this.enabled && e.keyCode == 13) {
                var text = this.$messageInput.val();

                if (text.length != 0) {
                    this.$messageInput.val("");

                    var newMessage = new Message(text, this.app.user.id, this.app.user.displayName, this.app.user.displayColor);

                    this.appendChatMessage(newMessage);

                    this.app.hub.server.addMessage(newMessage.serialize());
                }
            }
        });
    }

    private appendChatMessage(message: Message) {
        var element = document.createElement("div");

        var header = document.createElement("div");
        var footer = document.createElement("div");
        var content = document.createElement("div");

        header.classList.add("header");
        footer.classList.add("footer");
        content.classList.add("content");

        element.classList.add("message");

        header.innerText = message.senderName;
        content.innerText = message.text;

        if (this.previousMessage != null)
            if (message.sender == this.previousMessage.sender) {
                header.innerText = "";
                header.classList.add("emptyHeader");

                element.classList.add("messageUserRepeat");
            }

        element.appendChild(header);
        element.appendChild(content);
        element.appendChild(footer);

        $(header).css("background-color", message.color);

        this.$messageContainer.append(element);
        this.scrollDown();

        this.previousMessage = message;
    }

    private appendNotification(message: string, type: NotificationType) {
        var element = document.createElement("div");
        var content = document.createElement("div");
        var header = document.createElement("div");
        var footer = document.createElement("div");

        content.classList.add("content");
        footer.classList.add("footer");
        header.classList.add("header");

        element.classList.add("notification");

        switch (type) {
            case NotificationType.Error:
                element.classList.add("error");
                break;
            case NotificationType.Warning:
                element.classList.add("warning");
                break;
            case NotificationType.Info:
                element.classList.add("info");
                break;
        }

        content.innerText = message;

        element.appendChild(header);
        element.appendChild(content);
        element.appendChild(footer);

        this.$messageContainer.append(element);

        this.scrollDown();
    }

    public initializeFromSnapshot(snapshot: BoardSnapshot) {

        snapshot.messages.forEach(message => {
            message = Message.deserialize(message);

            this.appendChatMessage(message);
        });

        this.appendNotification(format("Welcome %s!", app.user.displayName), NotificationType.Info);
    }

    public onUserConnect(user: UserInfo): void {
        this.appendNotification(format("User %s has connected.", user.displayName), NotificationType.Info);
    }

    public onUserDisconnect(user: UserInfo): void {
        this.appendNotification(format("User %s has disconnected.", user.displayName), NotificationType.Info);
    }
} 
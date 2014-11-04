interface BoardClient {
    addMessage(message: Message);
}

interface BoardServer {
    addMessage(message: Message);
}

interface JQuery {
    modal(...args);
}

declare var katex;

enum NotificationType {
    Error,
    Warning,
    Info
}

class Chat {
    public enabled = false;

    private $messageContainer: JQuery;
    private $messageInput: JQuery;
    private $toggle: JQuery;
    private $messenger: JQuery;
    private $katexModal: JQuery;
    private $katexToggle: JQuery;
    private $katexInput: JQuery;

    private $katexInputText: JQuery;
    private $katexOutputText: JQuery;

    private previousMessage: Message;
    private wasPreviousANotification = false;

    private app: Application;

    private defaultMessengerWidth: string;
    private hidden = false;

    constructor(app: Application) {
        this.app = app;

        this.$messageContainer = $(".messageContainer");
        this.$messageInput = $(".input");
        this.$toggle = $(".switchButton");
        this.$messenger = $(".messenger");
        this.$katexModal = $(".katexModal");
        this.$katexToggle = $(".latexInput");
        this.$katexInput = $(".normalText .input");

        this.$katexInputText = $(".normalText .input");
        this.$katexOutputText = $(".renderedText");

        this.defaultMessengerWidth = this.$messageContainer.width() + "px";

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

                    var newMessage = new Message(text, this.app.user.id, this.app.user.displayName, this.app.user.displayColor, new Date().toString());

                    this.appendChatMessage(newMessage);

                    this.app.hub.server.addMessage(newMessage.serialize());
                }
            }
        });

        this.$toggle.click(e => {
            if (this.enabled) {
                if (this.hidden) {
                    this.$messenger.removeClass("in");
                    this.$messenger.addClass("out");
                }
                else {
                    this.$messenger.removeClass("out");
                    this.$messenger.addClass("in");
                }

                this.hidden = !this.hidden;
            }
        });

        this.$katexToggle.click(e => {
            this.$katexInput.val(this.$messageInput.val());

            Chat.updateKatexRenderedText();

            this.$katexModal.modal("show");
        });

        this.$katexInputText.keyup(e => {
            Chat.updateKatexRenderedText();
        });

        $(".katexSave").click(e => {
            this.$messageInput.val(this.$katexInputText.val());

            this.$katexModal.modal("hide");

            this.$katexInputText.val("");

            Chat.updateKatexRenderedText();
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
        content.innerHTML = Chat.convertStringToHtml(message.text);

        if (this.previousMessage != null && !this.wasPreviousANotification)
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

        this.wasPreviousANotification = false;
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

        this.wasPreviousANotification = true;
    }

    private static findEquations(text) {
        var result = [];
        var first = -1;

        for (var i = 0; i < text.length; i++) {
            if (text[i] == "`") {
                if (first == -1) {
                    first = i;
                }
                else {
                    result.push({
                        first: first,
                        second: i
                    });

                    first = -1;
                }
            }
        }

        return result;
    }

    private static convertStringToHtml(text) {
        try {
            var equations = Chat.findEquations(text);
            var resultHtml = "";

            var endOfPreviousEquation = -1;

            for (var i = 0; i < equations.length; i++) {
                var currentEquation = equations[i];

                var html = katex.renderToString(text.substring(currentEquation.first + 1, currentEquation.second));

                resultHtml += text.substring(endOfPreviousEquation + 1, currentEquation.first);

                resultHtml += html;

                endOfPreviousEquation = currentEquation.second;
            }

            resultHtml += text.substring(endOfPreviousEquation + 1, text.length);

            if (equations.length == 0) {
                resultHtml = text;
            }

            return resultHtml;
        }
        catch (e) {
            return e.message;
        }
    }

    public static updateKatexRenderedText() {
        var $input = $(".katexModal .normalText .input");
        var $output = $(".katexModal .renderedText");

        var text = $input.val();
        var html = Chat.convertStringToHtml(text);

        $output.html(html);
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
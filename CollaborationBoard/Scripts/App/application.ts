declare var boardId;

class Application {
    private _hub: HubProxy;
    private _user: UserInfo;
    private _canvas: Canvas;
    private _chat: Chat;
    private boardId: string;

    public constructor() {
        this._hub = $.connection.boardHub;
        this._canvas = new Canvas(this);
        this._chat = new Chat(this);

        this._hub.client.handshake = (user: UserInfo, snapshot: BoardSnapshot): void => {
            this._user = UserInfo.deserialize(user);
            this._canvas.enabled = true;
            this._chat.enabled = true;
            this._canvas.addLocalUser();
            this._canvas.initializeFromSnapshot(snapshot);
            this._chat.initializeFromSnapshot(snapshot);

            setTimeout(() => {
                $("#loadingBlind").addClass("fadeout");
            }, 500);
        };

        this._hub.client.connect = (user: UserInfo): void => {
            user = UserInfo.deserialize(user);

            this._canvas.onUserConnect(user);
            this._chat.onUserConnect(user);
        };

        this._hub.client.disconnect = (user: UserInfo): void => {
            user = UserInfo.deserialize(user);

            this._canvas.onUserDisconnect(user);
            this._chat.onUserDisconnect(user);
        };

        this.addEventListeners();

        $.connection.hub.start().done((): void => {
            this._hub.server.handshake(boardId);
        });
    }

    private addEventListeners() {
        $("#loadingBlind").on("webkitTransitionEnd", () => {
            $("#loadingBlind").hide();
        });
    }

    public get hub(): HubProxy {
        return this._hub;
    }

    public get user(): UserInfo {
        return this._user;
    }

    public get chat(): Chat {
        return this._chat;
    }

    public get canvas(): Canvas {
        return this._canvas;
    }
}

var app;

onload = (): void => {
    ExtendJQuery();
    app = new Application();
};
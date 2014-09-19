interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

declare var boardId;

interface BoardClient {
    handshake(user: UserInfo, snapshot: BoardSnapshot): void;
    connect(user: UserInfo): void;
    disconnect(user: UserInfo): void;
}

interface BoardServer {
    handshake(boardId: string): void;
}

class Application {
    private _hub: HubProxy;
    private _user: UserInfo;
    private canvas: Canvas;
    private chat: Chat;
    private boardId: string;

    public constructor() {
        this._hub = $.connection.boardHub;
        this.canvas = new Canvas(this);
        this.chat = new Chat(this);

        this._hub.client.handshake = (user: UserInfo, snapshot: BoardSnapshot): void => {
            this._user = UserInfo.deserialize(user);
            this.canvas.enabled = true;
            this.chat.enabled = true;
            this.canvas.initializeFromSnapshot(snapshot);
            this.chat.initializeFromSnapshot(snapshot);

            setTimeout(() => {
                $(".loadingBlind").addClass("fadeout");
            }, 500);
        };

        this._hub.client.connect = (user: UserInfo): void => {
            user = UserInfo.deserialize(user);

            this.canvas.onUserConnect(user);
            this.chat.onUserConnect(user);
        };

        this._hub.client.disconnect = (user: UserInfo): void => {
            user = UserInfo.deserialize(user);

            this.canvas.onUserDisconnect(user);
            this.chat.onUserDisconnect(user);
        };

        this.addEventListeners();

        $.connection.hub.start().done((): void => {
            this._hub.server.handshake(boardId);
        });
    }

    private addEventListeners() {
        $(".loadingBlind").on("webkitTransitionEnd", () => {
            $(".loadingBlind").hide();
        });
    }

    public get hub(): HubProxy {
        return this._hub;
    }

    public get user(): UserInfo {
        return this._user;
    }
}

var app;

onload = (): void => {
    ExtendJQuery();
    app = new Application();
};
declare var boardId;

class Application {
    public hub: HubProxy = $.connection.boardHub;
    public user: UserInfo;
    public canvas: Canvas;
    public chat: Chat;
    public boardId: string;

    public constructor() {
        this.canvas = new Canvas(this);
        this.chat = new Chat(this);

        this.hub.client.handshake = (user: UserInfo, snapshot: BoardSnapshot) => { this.handshake(user, snapshot); };
        this.hub.client.connect = (user: UserInfo) => { this.onConnect(user); };
        this.hub.client.disconnect = (user: UserInfo) => { this.onDisconnect; };

        $("#loadingBlind").on("webkitTransitionEnd", () => {
            $("#loadingBlind").hide();
        });

        $.connection.hub.start().done(() => { this.onConnectionStarted(); });
        $.connection.hub.reconnecting(() => { this.onReconnecting(); });
    }

    private onConnect(user: UserInfo): void {
        user = UserInfo.deserialize(user);

        this.canvas.onUserConnect(user);
        this.chat.onUserConnect(user);
    }

    private onDisconnect(user: UserInfo): void {
        user = UserInfo.deserialize(user);

        this.canvas.onUserDisconnect(user);
        this.chat.onUserDisconnect(user);
    }

    private handshake(user: UserInfo, snapshot: BoardSnapshot): void {
        this.user = UserInfo.deserialize(user);
        this.canvas.initializeFromSnapshot(snapshot);
        this.chat.initializeFromSnapshot(snapshot);

        setTimeout(() => {
            $("#loadingBlind").addClass("fadeout");
        }, 500);
    }

    private onConnectionStarted(): void {
        this.hub.server.handshake(boardId);
    }

    private onReconnecting(): void {
        this.canvas.userTool.release();

        this.canvas.networkInputEnabled = false;
        this.canvas.localInputEnabled = false;
        this.chat.networkInputEnabled = false;
        this.chat.localInputEnabled = false;

        $("#disconnectedBlind").css("visibility", "initial");
    }
}

var app;

onload = (): void => {
    ExtendJQuery();
    app = new Application();
};
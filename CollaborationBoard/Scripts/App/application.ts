interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

declare var boardId;

interface BoardClient {
    handshake(cid: string, snapshot: BoardSnapshot): void;
    connect(cid: string): void;
    disconnect(cid: string): void;
}

interface BoardServer {
    handshake(boardId: string): void;
}

class Application {
    private _hub: HubProxy;
    private _cid: string;
    private canvas: Canvas;
    private chat: Chat;
    private boardId: string;

    public constructor() {
        this._hub = $.connection.boardHub;
        this.canvas = new Canvas(this);
        this.chat = new Chat(this);

        this._hub.client.handshake = (cid: string, snapshot: BoardSnapshot): void => {
            this._cid = cid;
            this.canvas.enabled = true;
            this.canvas.initializeFromSnapshot(snapshot);
            this.chat.initializeFromSnapshot(snapshot);
        };

        this._hub.client.connect = (cid: string): void => {
            this.canvas.onUserConnect(cid);
        };

        this._hub.client.disconnect = (cid: string): void => {
            this.canvas.onUserDisconnect(cid);
        };

        $.connection.hub.start().done((): void => {
            this._hub.server.handshake(boardId);
        });
    }

    public get hub(): HubProxy {
        return this._hub;
    }

    public get cid(): string {
        return this._cid;
    }
}

var app;

onload = (): void => {
    ExtendJQuery();
    app = new Application();
};
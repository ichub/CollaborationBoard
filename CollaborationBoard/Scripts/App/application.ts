interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

declare var boardId;

interface BoardClient {
    handshake( neighbor: Array<string>, actions: Array<DrawEvent>): void;
    connect(cid: string): void;
    disconnect(cid: string): void;
}

interface BoardServer {
    handshake(boardId: string): void;
}

class Application {
    private _hub: HubProxy;
    private draw: Canvas;
    private boardId: string;

    public constructor() {
        this._hub = $.connection.boardHub;
        this.draw = new Canvas(this, "drawCanvas");

        this._hub.client.handshake = (neighbors: Array<string>, actions: Array<DrawEvent>): void => {
            this.draw.enabled = true;
            this.draw.processLoadEvents(actions);
        };

        this._hub.client.connect = (cid: string): void => {
            this.draw.onUserConnect(cid);
        };

        this._hub.client.disconnect = (cid: string): void => {
            this.draw.onUserDisconnect(cid);
        };

        $.connection.hub.start().done((): void => {
            this._hub.server.handshake(boardId);
        });
    }

    public get hub(): HubProxy {
        return this._hub;
    }
}

var app;

onload = (): void => {
    document.body["scroll"] = "no";
    ExtendJQuery();
    app = new Application();
};
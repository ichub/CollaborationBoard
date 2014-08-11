interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

declare var boardId;

interface BoardClient {
    handshake(neighbor: Array<string>, actions: Array<DrawEvent>): void;
    connect(cid: string): void;
    disconnect(cid: string): void;
}

interface BoardServer {
    handshake(boardId: string): void;
}

class Application {
    private draw: Canvas;
    private boardId: string;
    public hub: HubProxy;

    public constructor() {
        this.hub = $.connection.boardHub;
        this.draw = new Canvas(this, "drawCanvas");

        this.hub.client.handshake = (neighbors: Array<string>, actions: Array<DrawEvent>): void => {
            this.draw.enabled = true;
            this.draw.processLoadEvents(actions);
        };

        this.hub.client.connect = (cid: string): void => {
            this.draw.onUserConnect(cid);
        };

        this.hub.client.disconnect = (cid: string): void => {
            this.draw.onUserDisconnect(cid);
        };

        $.connection.hub.start().done((): void => {
            this.hub.server.handshake(boardId);
        });
    }
}

var app;

onload = (): void => {
    ExtendJQuery();
    app = new Application();
};
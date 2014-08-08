interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

declare var boardId;

interface BoardClient {
    handshake(neighbor: Array<string>): void;
    connect(cid: string): void;
}

interface BoardServer {
    handshake(boardId: string): void;
}

class BoardManager {
    private  draw: DrawManager;
    private boardId: string;
    public hub: HubProxy;

    constructor() {
        this.hub = $.connection.boardHub;
        this.draw = new DrawManager(this, "drawCanvas");

        this.hub.client.handshake = (neighbors: Array<string>): void => {
            this.draw.enableDrawing();
        };

        this.hub.client.connect = (cid) => {
            this.draw.onUserConnect(cid);
        };

        $.connection.hub.start().done((): void => {
            this.hub.server.handshake(boardId);
        });
    }
}

onload = () => {
    ExtendJQuery();
    var manager = new BoardManager();
};
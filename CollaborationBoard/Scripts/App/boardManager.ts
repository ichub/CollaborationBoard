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
    draw: DrawManager;
    boardId: string;
    board: HubProxy;

    constructor() {
        this.board = $.connection.boardHub;
        this.draw = new DrawManager(this, "drawCanvas");

        this.board.client.handshake = (neighbors: Array<string>): void => {
            this.draw.enableDrawing();
        };

        this.board.client.connect = (cid) => {
            this.draw.onUserConnect(cid);
        };

        $.connection.hub.start().done((): void => {
            this.board.server.handshake(boardId);
        });
    }
}

onload = () => {
    ExtendJQuery();
    var manager = new BoardManager();
};
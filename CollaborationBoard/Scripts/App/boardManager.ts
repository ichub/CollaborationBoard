interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

declare var boardId;

interface BoardClient {
    handshake(cid: string): void;
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
        this.draw = new DrawManager(this, $("#drawCanvas"));

        this.board.client.handshake = (): void => {
            this.draw.getDrawState();
        };

        $.connection.hub.start().done((): void => {
            this.board.server.handshake(boardId);
        });
    }
} 

onload = function () {
    ExtendJQuery();
    var manager = new BoardManager();
};
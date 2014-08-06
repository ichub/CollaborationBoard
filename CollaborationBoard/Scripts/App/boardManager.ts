interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

declare var boardId;

interface BoardClient {
    draw(cid: string, x1: number, y1: number, x2: number, y2: number): void;
    handshake(cid: string): void;
    state(state): void;
}

interface BoardServer {
    draw(x1: number, y1: number, x2: number, y2: number): void;
    getState(): void;
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
            this.draw.enable();
        };

        $.connection.hub.start().done((): void => {
            this.board.server.handshake(boardId);
        });
    }

    sendServerDraw(from: Point, to: Point): void {
        this.board.server.draw(from.x, from.y, to.x, to.y);
    }

    getDrawState(): void {
        this.board.server.getState();
    }
} 

onload = function () {
    ExtendJQuery();
    var manager = new BoardManager();
};
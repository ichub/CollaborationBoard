interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

interface BoardClient {
    draw(cid: string, x1: number, y1: number, x2: number, y2: number): void;
    recieveId(cid: string): void;
}

interface BoardServer {
    draw(x1: number, y1: number, x2: number, y2: number): void;
    registerId(): string;
}

class BoardManager {
    draw: DrawManager;
    boardId: string;
    clientId: string;
    board: HubProxy;

    constructor() {
        this.board = $.connection.boardHub;
        this.draw = new DrawManager(this, $("#drawCanvas"));

        this.board.client.recieveId = (cid: string): void => {
            this.clientId = cid;

            this.draw.enable();
        };

        $.connection.hub.start().done((): void => {
            this.board.server.registerId();
        });
    }

    sendServerDraw(from: Point, to: Point): void {
        this.board.server.draw(from.x, from.y, to.x, to.y);
    }
} 
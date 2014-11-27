interface SignalR {
    boardHub: HubProxy;
}

interface HubProxy {
    client: BoardClient;
    server: BoardServer;
}

interface BoardClient {
    handshake(user: UserInfo, snapshot: BoardSnapshot): void;
    connect(user: UserInfo): void;
    disconnect(user: UserInfo): void;
    onDrawEvent(event: DrawEvent);
    onToolChange(userId: string, toolName: string): void;
    addMessage(message: Message);
    addTextEntity(entity: TextEntity);
    textEntityUpdateText(id: string, text: string);
    entityMove(id: string, to: Point);
}

interface BoardServer {
    handshake(boardId: string): void;
    onDrawEvent(event: DrawEvent);
    onToolChange(toolName: string): void;
    addMessage(message: Message);
    addTextEntity(entity: TextEntity);
    textEntityUpdateText(id: string, text: string);
    entityMove(id: string, to: Point);
}
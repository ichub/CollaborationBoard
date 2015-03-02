class UserInfo {
    public displayName: string;
    public id: string;
    public boardId: string;

    constructor(displayName: string, cid: string, boardId: string) {
        this.displayName = displayName,
        this.id = cid;
        this.boardId = boardId;
    }

    public serialize(): any {
        return {
            displayName: this.displayName,
            id: this.id,
        }
    }

    public static deserialize(serialized: any): UserInfo {
        return new UserInfo(serialized.displayName, serialized.id, serialized.boardId);
    }
} 
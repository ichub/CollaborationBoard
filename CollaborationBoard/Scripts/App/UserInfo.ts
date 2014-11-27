class UserInfo {
    public displayName: string;
    public displayColor: string;
    public id: string;
    public boardId: string;

    constructor(displayName: string, displayColor: string, cid: string, boardId: string) {
        this.displayColor = displayColor,
        this.displayName = displayName,
        this.id = cid;
        this.boardId = boardId;
    }

    public serialize(): any {
        return {
            displayName: this.displayName,
            displayColor: this.displayColor,
            id: this.id,
        }
    }

    public static deserialize(serialized: any): UserInfo {
        return new UserInfo(serialized.displayName, serialized.displayColor, serialized.id, serialized.boardId);
    }
} 
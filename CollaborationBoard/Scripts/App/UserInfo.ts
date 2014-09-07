﻿class UserInfo {
    private _displayName: string;
    private _displayColor: string;
    private _cid: string;
    private _boardId: string;

    constructor(displayName: string, displayColor: string, cid: string, boardId: string) {
        this._displayColor = displayColor,
        this._displayName = displayName,
        this._cid = cid;
        this._boardId = boardId;
    }

    public get displayName() {
        return this._displayName;
    }

    public get displayColor() {
        return this._displayColor;
    }

    public get cid() {
        return this._cid;
    }

    public get boardId() {
        return this._boardId;
    }

    public serialize(): any {
        return {
            displayName: this._displayName,
            displayColor: this._displayColor,
            cid: this._cid,
        }
    }

    public static deserialize(serialized: any): UserInfo {
        return new UserInfo(serialized.displayName, serialized.displayColor, serialized.cid, serialized.boardId);
    }
} 
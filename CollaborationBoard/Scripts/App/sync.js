(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var sync = function () {
        this.lastSync = -1; // must be -1 to load everything
        this.syncTimeOut = null;

        var board = $.connection.boardHub;

        board.client.ping = function (text) {
            alert(text);
        };

        $.connection.hub.start().done(function () {
            board.server.ping("asdf");
        });
    };

    sync.prototype.serverPost = function (data, url) {
        return $.ajax({
            data: JSON.stringify(data),
            type: "POST",
            url: url,
        });
    };

    sync.prototype.serverGet = function (url) {
        return $.ajax({
            type: "GET",
            url: url,
        });
    };

    sync.prototype.syncOnce = function (data) {
        return this.serverPost(data, format("/Board/Sync/%s/%s", Collab.Id, this.lastSync));
    }

    sync.prototype.syncLoopStep = function (dataPopFn, syncCallback) {
        var that = this;

        var data = dataPopFn();

        this.syncOnce(data).done(function (response) {
            that.lastSync = response.LastSync;

            Collab.logger.log(that.lastSync);

            syncCallback(response.Actions);

            that.syncTimeOut = setTimeout(function () {
                that.syncLoopStep(dataPopFn, syncCallback);
            }, 0);
        });
    };

    sync.prototype.startSyncLoop = function (dataPopFn, syncCallback) {
        this.syncLoopStep(dataPopFn, syncCallback);
    };

    sync.prototype.endSyncLoop = function () {
        if (this.syncTimeOut != null) {
            clearTimeout(this.syncTimeOut);

            this.syncTimeOut = null;
        }
    };

    Collab.Sync = sync;
})();
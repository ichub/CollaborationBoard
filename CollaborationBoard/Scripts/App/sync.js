(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var Sync = function () {
        this.lastSync = -1; // must be -1 to load everything
        this.syncTimeOut = null;
    };

    Sync.prototype.serverPost = function (data, url) {
        return $.ajax({
            data: JSON.stringify(data),
            type: "POST",
            url: url,
        });
    };

    Sync.prototype.serverGet = function (url) {
        return $.ajax({
            type: "GET",
            url: url,
        });
    };

    Sync.prototype.syncOnce = function (data) {
        return this.serverPost(data, format("/Board/Sync/%s/%s", Collab.Id, this.lastSync));
    }

    Sync.prototype.syncLoopStep = function (dataPopFn, syncCallback) {
        var that = this;

        var data = dataPopFn();

        this.syncOnce(data).done(function (response) {
            that.lastSync = response.LastSync;

            Collab.logger.log(that.lastSync);

            syncCallback(response.Actions);

            that.syncTimeOut = setTimeout(function () {
                that.syncLoopStep(dataPopFn, syncCallback);
            }, 100);
        });
    };

    Sync.prototype.startSyncLoop = function (dataPopFn, syncCallback) {
        this.syncLoopStep(dataPopFn, syncCallback);
    };

    Sync.prototype.endSyncLoop = function () {
        if (this.syncTimeOut != null) {
            clearTimeout(this.syncTimeOut);

            this.syncTimeOut = null;
        }
    };

    Collab.sync = new Sync();
})();
(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var Sync = function () {
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

    Sync.prototype.syncOnce = function (data, lastSync) {
        return this.serverPost(data, format("/Board/Sync/%s/%s", Collab.Id, lastSync));
    }

    Sync.prototype.syncLoopStep = function (dataPopFn, lastSync, syncCallback) {
        var that = this;
        this.syncTimeOut = setTimeout(function () {
            var data = dataPopFn();

            that.syncOnce(data, lastSync).done(function (response) {
                syncCallback(response);

                that.syncLoopStep(dataPopFn, lastSync, syncCallback);
            });
        }, 1000);
    };

    Sync.prototype.startSyncLoop = function (dataPopFn, lastSync, syncCallback) {
        this.syncLoopStep(dataPopFn, lastSync, syncCallback);
    };

    Sync.prototype.endSyncLoop = function () {
        if (this.syncTimeOut != null) {
            clearTimeout(this.syncTimeOut);

            this.syncTimeOut = null;
        }
    };

    Collab.sync = new Sync();
})();
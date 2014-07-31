(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    Collab.instance = new Object();

    var instance = Collab.instance;

    var popSyncData = function () {
        var lines = instance.drawManager.flushPending();
        var messages = [];

        return new Collab.ActionGroup(messages, lines);
    };

    var onSync = function (actionGroups) {
        for (var i = 0; i < actionGroups.length; i++) {
            instance.drawManager.updateLines(actionGroups[i].Lines);
        }
    };

    window.onload = function () {
        var canvas = $("#drawCanvas");
        instance.drawManager = new Collab.DrawManager(canvas[0]);

        Collab.sync.startSyncLoop(popSyncData, onSync);
    };
})();
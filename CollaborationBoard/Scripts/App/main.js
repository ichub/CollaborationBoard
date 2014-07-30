(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    Collab.instance = new Object();

    var instance = Collab.instance;

    window.onload = function () {
        var canvas = $("#drawCanvas");
        instance.drawManager = new Collab.DrawManager(canvas[0]);
        Collab.sync.startSyncLoop(function () {
            return { Actions: [{ User: "asdf" }, {User: "asdf", Message: "asdf"}] };
        }, 0, function (response) {
        });
    };
})();
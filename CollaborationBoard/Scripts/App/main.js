(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    Collab.Instance = new Object();

    var instance = Collab.Instance;

    window.onload = function () {
        var canvas = $("#drawCanvas");
        instance.drawManager = new Collab.DrawManager(canvas[0]);
    };
})();
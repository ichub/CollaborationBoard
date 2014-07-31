(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var actionGroup = function (messages, lines) {
        this.Messages = messages;
        this.Lines = lines;
    };

    actionGroup.empty = new actionGroup([], []);

    var point = function (x, y) {
        this.X = x || 0;
        this.Y = y || 0;
    };

    var line = function (points) {
        this.Points = points || [];
    };

    var message = function (text) {
        this.text = text || "";
    };

    Collab.Point = point;
    Collab.Line = line;
    Collab.Message = message;
    Collab.ActionGroup = actionGroup
})();
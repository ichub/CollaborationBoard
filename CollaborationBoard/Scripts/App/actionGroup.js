(function () {
    "use strict";

    window.Collab = window.Collab || new Object();

    var actionGroup = function (messages, lines) {
        this.messages = messages;
        this.lines = lines;
    };

    actionGroup.empty = new actionGroup([], []);

    Collab.ActionGroup = actionGroup
})();
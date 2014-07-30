(function () {
    "use strict";

    window.Collab = window.Collab || {};

    var logger = function () {
        this.enabled = true;
    };

    logger.prototype.log = function (text) {
        if (this.enabled) {
            console.log(text);
        }
    };

    Collab.logger = new logger();
})();
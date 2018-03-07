"use strict";
module.exports = function () {
    return [
        // Whitespace is always a word boundary.
        " ", "\\n", "\\r", "\\t",
        // NO-BREAK SPACE.
        "\u00a0",
        " ",
        ".", ",", "'", "(", ")", "\"", "+", "-", ";", "!", "?", ":", "/", "»", "«", "‹", "›", "<", ">"
    ];
};
//# sourceMappingURL=wordBoundaries.js.map
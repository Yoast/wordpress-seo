"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSentences = require("../stringProcessing/getSentences");
/**
 * @param {Paper} paper The paper to analyze.
 */
function default_1(paper) {
    return getSentences(paper.getText());
}
exports.default = default_1;
//# sourceMappingURL=sentences.js.map
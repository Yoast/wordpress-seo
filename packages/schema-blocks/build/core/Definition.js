"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/**
 * Definition clas
 */
var Definition = /** @class */ (function () {
    /**
     * Creates a block BlockDefinition.
     *
     * @param separator    The separator used.
     * @param template     The template.
     * @param instructions The parsed instructions.
     * @param tree         The parsed leaves.
     */
    function Definition(separator, template, instructions, tree) {
        if (template === void 0) { template = ""; }
        if (instructions === void 0) { instructions = {}; }
        if (tree === void 0) { tree = null; }
        this.separator = separator;
        this.template = template;
        this.instructions = instructions;
        this.tree = tree;
    }
    /**
     * Returns the configuration of this BlockDefinition.
     *
     *@returns The configuration.
     */
    Definition.prototype.configuration = function () {
        return Object.values(this.instructions).reduce(function (config, instruction) { return lodash_1.merge(config, instruction.configuration()); }, {});
    };
    return Definition;
}());
exports.default = Definition;

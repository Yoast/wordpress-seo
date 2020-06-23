"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./instructions");
var process_1 = __importDefault(require("./functions/process"));
var SchemaDefinition_1 = __importDefault(require("./core/schema/SchemaDefinition"));
var SchemaInstruction_1 = __importDefault(require("./core/schema/SchemaInstruction"));
var BlockDefinition_1 = __importDefault(require("./core/blocks/BlockDefinition"));
var BlockInstruction_1 = __importDefault(require("./core/blocks/BlockInstruction"));
var watch_1 = __importDefault(require("./functions/gutenberg/watch"));
var filter_1 = __importDefault(require("./functions/gutenberg/filter"));
/**
 * Initializes schema-templates.
 */
function initialize() {
    jQuery('script[type="text/schema-template"]').each(function () {
        try {
            var template = this.innerHTML.split("\n").map(function (s) { return s.trim(); }).join("");
            var definition = process_1.default(template, SchemaDefinition_1.default, SchemaInstruction_1.default);
            definition.register();
        }
        catch (e) {
            console.error("Failed parsing schema-template", e, this);
        }
    });
    // Filter in our schema definitions with Gutenberg.
    filter_1.default();
    jQuery('script[type="text/block-template"]').each(function () {
        try {
            var template = this.innerHTML.split("\n").map(function (s) { return s.trim(); }).join("");
            var definition = process_1.default(template, BlockDefinition_1.default, BlockInstruction_1.default);
            definition.register();
        }
        catch (e) {
            console.error("Failed parsing guten-template", e, this);
        }
    });
    // Watch Gutenberg for block changes that require schema updates.
    watch_1.default();
}
exports.default = initialize;

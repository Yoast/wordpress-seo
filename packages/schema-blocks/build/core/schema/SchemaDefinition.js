"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Definition_1 = __importDefault(require("../Definition"));
var parse_1 = __importDefault(require("../../functions/schema/parse"));
exports.schemaDefinitions = {};
/**
 * Schema definition class
 */
var SchemaDefinition = /** @class */ (function (_super) {
    __extends(SchemaDefinition, _super);
    function SchemaDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders a schema definition.
     *
     * @param block The block.
     *
     * @returns The rendered schema.
     */
    SchemaDefinition.prototype.render = function (block) {
        return this.tree.render(block);
    };
    /**
     * Registers a schema definition.
     */
    SchemaDefinition.prototype.register = function () {
        var configuration = this.configuration();
        exports.schemaDefinitions[configuration.name] = this;
    };
    /**
     * Returns whether or not schema should only be rendered for nested blocks.
     *
     * @returns Whether or not schema should only be rendered for nested blocks.
     */
    SchemaDefinition.prototype.onlyNested = function () {
        var configuration = this.configuration();
        return configuration.onlyNested === true;
    };
    /**
     * Returns whether or not schema should be rendered even for nested blocks.
     *
     * @returns Whether or not schema should be rendered even for nested blocks.
     */
    SchemaDefinition.prototype.separateInGraph = function () {
        var configuration = this.configuration();
        return configuration.separateInGraph === true;
    };
    SchemaDefinition.separatorCharacters = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    SchemaDefinition.parser = parse_1.default;
    return SchemaDefinition;
}(Definition_1.default));
exports.default = SchemaDefinition;

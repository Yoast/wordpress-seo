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
var element_1 = require("@wordpress/element");
var blocks_1 = require("@wordpress/blocks");
var block_editor_1 = require("@wordpress/block-editor");
var Definition_1 = __importDefault(require("../Definition"));
var parse_1 = __importDefault(require("../../functions/blocks/parse"));
/**
 * BlockDefinition clas
 */
var BlockDefinition = /** @class */ (function (_super) {
    __extends(BlockDefinition, _super);
    function BlockDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders editing the block.
     *
     * @param props The props.
     *
     * @returns The rendered block.
     */
    BlockDefinition.prototype.edit = function (props) {
        // Take the children directly to avoid creating too many Fragments.
        var elements = this.tree.children.map(function (leaf, i) { return leaf.edit(props, i); }).filter(function (e) { return e !== null; });
        var sidebarElements = Object.values(this.instructions)
            .map(function (instruction, i) { return instruction.sidebar(props, i); })
            .filter(function (e) { return e !== null; });
        if (sidebarElements.length > 0) {
            var sidebar = element_1.createElement(block_editor_1.InspectorControls, null, sidebarElements);
            elements.unshift(sidebar);
        }
        if (elements.length === 1) {
            return elements[0];
        }
        return element_1.createElement(element_1.Fragment, null, elements);
    };
    /**
     * Renders saving the block.
     *
     * @param props The props.
     *
     * @returns The rendered block.
     */
    BlockDefinition.prototype.save = function (props) {
        return this.tree.save(props);
    };
    /**
     * Registers the block with Gutenberg.
     */
    BlockDefinition.prototype.register = function () {
        var _this = this;
        var configuration = this.configuration();
        var name = configuration.name;
        delete configuration.name;
        configuration.edit = function (props) { return _this.edit(props); };
        configuration.save = function (props) { return _this.save(props); };
        blocks_1.registerBlockType(name, configuration);
    };
    BlockDefinition.separatorCharacters = ["@", "#", "$", "%", "^", "&", "*", "(", ")", "{", "}", "[", "]"];
    BlockDefinition.parser = parse_1.default;
    return BlockDefinition;
}(Definition_1.default));
exports.default = BlockDefinition;

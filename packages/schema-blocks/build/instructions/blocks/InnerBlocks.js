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
var block_editor_1 = require("@wordpress/block-editor");
var BlockInstruction_1 = __importDefault(require("../../core/blocks/BlockInstruction"));
/**
 * InnerBlocks instruction
 */
var InnerBlocks = /** @class */ (function (_super) {
    __extends(InnerBlocks, _super);
    function InnerBlocks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders saving the instruction.
     *
     *
     * @returns The inner blocks.
     */
    InnerBlocks.prototype.save = function () {
        return element_1.createElement(block_editor_1.InnerBlocks.Content);
    };
    /**
     * Renders editing the instruction.
     *
     *
     * @returns The inner blocks.
     */
    InnerBlocks.prototype.edit = function () {
        var _this = this;
        var attributes = {};
        if (this.options.appender === "button") {
            attributes.renderAppender = function () {
                // The type definition of InnerBlocks are wrong so cast to fix them.
                return element_1.createElement(block_editor_1.InnerBlocks.ButtonBlockAppender);
            };
        }
        else {
            attributes.renderAppender = function () { return element_1.createElement(block_editor_1.InnerBlocks.DefaultBlockAppender); };
        }
        if (typeof this.options.appenderLabel === "string") {
            attributes.renderAppender = function () {
                return element_1.createElement("div", { className: "yoast-labeled-inserter", "data-label": _this.options.appenderLabel }, [element_1.createElement(block_editor_1.InnerBlocks.ButtonBlockAppender)]);
            };
        }
        if (this.options.allowedBlocks) {
            attributes.allowedBlocks = this.options.allowedBlocks;
        }
        return element_1.createElement(block_editor_1.InnerBlocks, attributes);
    };
    return InnerBlocks;
}(BlockInstruction_1.default));
BlockInstruction_1.default.register("inner-blocks", InnerBlocks);

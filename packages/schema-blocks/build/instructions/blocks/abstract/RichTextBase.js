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
var BlockInstruction_1 = __importDefault(require("../../../core/blocks/BlockInstruction"));
/**
 * RichText instruction
 */
var RichTextBase = /** @class */ (function (_super) {
    __extends(RichTextBase, _super);
    function RichTextBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders saving the rich text.
     *
     * @param props The render props.
     * @param leaf  The leaf being rendered.
     * @param i     The number child this is.
     *
     * @returns The RichText element.
     */
    RichTextBase.prototype.save = function (props, leaf, i) {
        return element_1.createElement(block_editor_1.RichText.Content, this.getBaseAttributes(props, i));
    };
    /**
     * Renders editing the rich text.
     *
     * @param props The render props.
     * @param leaf  The leaf being rendered.
     * @param i     The number child this is.
     *
     * @returns The RichText element.
     */
    RichTextBase.prototype.edit = function (props, leaf, i) {
        var _this = this;
        var attributes = this.getBaseAttributes(props, i);
        attributes.onChange = function (value) {
            var _a;
            return props.setAttributes((_a = {}, _a[_this.options.name] = value, _a));
        };
        if (this.options.placeholder) {
            attributes.placeholder = this.options.placeholder;
        }
        return element_1.createElement(block_editor_1.RichText, attributes);
    };
    /**
     * Adds the RichText attributes to the block configuration.
     *
     * @returns The block configuration.
     */
    RichTextBase.prototype.configuration = function () {
        var _a;
        return {
            attributes: (_a = {},
                _a[this.options.name] = {
                    type: "string",
                    source: "html",
                    selector: "[data-id=" + this.options.name + "]",
                    "default": this.options.default,
                },
                _a),
        };
    };
    return RichTextBase;
}(BlockInstruction_1.default));
exports.default = RichTextBase;

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
var BlockInstruction_1 = __importDefault(require("../../core/blocks/BlockInstruction"));
var RichTextBase_1 = __importDefault(require("./abstract/RichTextBase"));
var element_1 = require("@wordpress/element");
var components_1 = require("@wordpress/components");
var select_1 = require("../../functions/select");
/**
 * RichText instruction
 */
var VariableTagRichText = /** @class */ (function (_super) {
    __extends(VariableTagRichText, _super);
    function VariableTagRichText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Adds the RichText attributes to the block configuration.
     *
     * @returns The block configuration.
     */
    VariableTagRichText.prototype.configuration = function () {
        var _a;
        return {
            attributes: (_a = {},
                _a[this.options.name] = {
                    type: "string",
                    source: "html",
                    selector: "[data-id=" + this.options.name + "]",
                },
                _a[this.options.name + "_tag"] = {
                    type: "string",
                },
                _a),
        };
    };
    /**
     * Renders the sidebar.
     *
     * @param props The render props.
     * @param i     The number sidebar element this is.
     *
     * @returns The sidebar element.
     */
    VariableTagRichText.prototype.sidebar = function (props, i) {
        var _this = this;
        return element_1.createElement(components_1.SelectControl, {
            label: this.options.label,
            value: props.attributes[this.options.name + "_tag"],
            options: select_1.arrayOrObjectToOptions(this.options.tags),
            onChange: function (value) {
                var _a;
                return props.setAttributes((_a = {}, _a[_this.options.name + "_tag"] = value, _a));
            },
            key: i,
        });
    };
    /**
     * Gets the base attributes of the rich text.
     *
     * @param props The props.
     * @param i     The number child this is.
     *
     * @returns The base attributes.
     */
    VariableTagRichText.prototype.getBaseAttributes = function (props, i) {
        var attributes = {
            tagName: props.attributes[this.options.name + "_tag"] ||
                select_1.arrayOrObjectToOptions(this.options.tags)[0].value,
            value: props.attributes[this.options.name],
            className: this.options.class,
            placeholder: this.options.placeholder,
            "data-id": this.options.name,
            key: i,
        };
        if (this.options.multiline) {
            attributes.multiline = this.options.multiline;
        }
        return attributes;
    };
    return VariableTagRichText;
}(RichTextBase_1.default));
BlockInstruction_1.default.register("variable-tag-rich-text", VariableTagRichText);

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
/**
 * RichText instruction
 */
var RichText = /** @class */ (function (_super) {
    __extends(RichText, _super);
    function RichText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets the base attributes of the rich text.
     *
     * @param props The props.
     * @param i     The number child this is.
     *
     * @returns The base attributes.
     */
    RichText.prototype.getBaseAttributes = function (props, i) {
        var attributes = {
            tagName: this.options.tag,
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
    return RichText;
}(RichTextBase_1.default));
BlockInstruction_1.default.register("rich-text", RichText);

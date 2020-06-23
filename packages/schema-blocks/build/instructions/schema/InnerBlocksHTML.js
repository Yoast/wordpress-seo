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
var SchemaInstruction_1 = __importDefault(require("../../core/schema/SchemaInstruction"));
var html_1 = require("../../functions/html");
var blocks_1 = require("../../functions/blocks");
/**
 * InnerBlocks instruction
 */
var InnerBlocksHTML = /** @class */ (function (_super) {
    __extends(InnerBlocksHTML, _super);
    function InnerBlocksHTML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders schema.
     *
     * @param block The block.
     *
     * @returns The schema.
     */
    InnerBlocksHTML.prototype.render = function (block) {
        var values = blocks_1.getInnerBlocksAttributes(block.clientId, this.options.blocks);
        if (this.options.onlyFirst === true) {
            values = values.slice(0, 1);
        }
        else if (this.options.skipFirst === true) {
            values = values.slice(1);
        }
        if (values.length === 0 && this.options.nullWhenEmpty) {
            return null;
        }
        var html = values.map(function (_a) {
            var value = _a.value;
            return value;
        }).join(this.options.split || " ");
        return html_1.stripTags(html, this.options.allowedTags);
    };
    return InnerBlocksHTML;
}(SchemaInstruction_1.default));
SchemaInstruction_1.default.register("inner-blocks-html", InnerBlocksHTML);

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
var data_1 = require("@wordpress/data");
var SchemaInstruction_1 = __importDefault(require("../../core/schema/SchemaInstruction"));
var SchemaDefinition_1 = require("../../core/schema/SchemaDefinition");
/**
 * InnerBlocks instruction
 */
var InnerBlocks = /** @class */ (function (_super) {
    __extends(InnerBlocks, _super);
    function InnerBlocks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders schema.
     *
     * @param block The block.
     *
     * @returns The schema.
     */
    InnerBlocks.prototype.render = function (block) {
        var _this = this;
        var innerBlocks = data_1.select("core/block-editor").getBlocksByClientId(block.clientId)[0].innerBlocks;
        if (this.options.allowedBlocks) {
            innerBlocks = innerBlocks.filter(function (innerBlock) { return _this.options.allowedBlocks.includes(innerBlock.name); });
        }
        if (this.options.onlyFirst === true) {
            innerBlocks = innerBlocks.slice(0, 1);
        }
        var rendered = innerBlocks.map(function (innerBlock) {
            var schemaDefinition = SchemaDefinition_1.schemaDefinitions[innerBlock.name];
            if (!schemaDefinition) {
                return null;
            }
            return schemaDefinition.render(innerBlock);
        }).filter(function (schema) { return schema !== null; });
        if (this.options.onlyFirst === true) {
            return rendered[0];
        }
        return rendered;
    };
    return InnerBlocks;
}(SchemaInstruction_1.default));
SchemaInstruction_1.default.register("inner-blocks", InnerBlocks);

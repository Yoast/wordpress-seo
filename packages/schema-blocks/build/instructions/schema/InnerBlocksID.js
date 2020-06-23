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
var data_1 = require("@wordpress/data");
var block_1 = require("../../functions/gutenberg/block");
/**
 * InnerBlocksID instruction
 */
var InnerBlocksID = /** @class */ (function (_super) {
    __extends(InnerBlocksID, _super);
    function InnerBlocksID() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders schema.
     *
     * @param block The block.
     *
     * @returns The schema.
     */
    InnerBlocksID.prototype.render = function (block) {
        var _this = this;
        var innerBlocks = data_1.select("core/block-editor").getBlocksByClientId(block.clientId)[0].innerBlocks;
        if (this.options.allowedBlocks) {
            innerBlocks = innerBlocks.filter(function (innerBlock) { return _this.options.allowedBlocks.includes(innerBlock.name); });
        }
        if (this.options.onlyFirst === true) {
            innerBlocks = innerBlocks.slice(0, 1);
        }
        else if (this.options.skipFirst === true) {
            innerBlocks = innerBlocks.slice(1);
        }
        if (innerBlocks.length === 0 && this.options.nullWhenEmpty) {
            return null;
        }
        var ids = innerBlocks.map(function (innerBlock) { return ({ "@id": block_1.getBlockSchemaId(innerBlock) }); });
        if (ids.length === 1) {
            return ids[0];
        }
        return ids;
    };
    return InnerBlocksID;
}(SchemaInstruction_1.default));
SchemaInstruction_1.default.register("inner-blocks-id", InnerBlocksID);

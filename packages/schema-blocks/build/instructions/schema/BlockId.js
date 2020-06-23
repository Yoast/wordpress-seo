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
var block_1 = require("../../functions/gutenberg/block");
/**
 * BlockID instruction
 */
var BlockID = /** @class */ (function (_super) {
    __extends(BlockID, _super);
    function BlockID() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders schema.
     *
     * @param block The block.
     *
     * @returns The schema.
     */
    BlockID.prototype.render = function (block) {
        return block_1.getBlockSchemaId(block);
    };
    return BlockID;
}(SchemaInstruction_1.default));
SchemaInstruction_1.default.register("block-id", BlockID);

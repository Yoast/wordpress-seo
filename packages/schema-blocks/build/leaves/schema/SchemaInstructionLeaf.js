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
var SchemaLeaf_1 = __importDefault(require("../../core/schema/SchemaLeaf"));
/**
 * SchemaInstructionLeaf class
 */
var SchemaInstructionLeaf = /** @class */ (function (_super) {
    __extends(SchemaInstructionLeaf, _super);
    /**
     * Constructs a schema instruction leaf.
     *
     * @param instruction The instruction.
     */
    function SchemaInstructionLeaf(instruction) {
        var _this = _super.call(this) || this;
        _this.instruction = instruction;
        return _this;
    }
    /**
     * Renders a schema leaf.
     *
     * @param block The block.
     *
     * @returns The rendered schema.
     */
    SchemaInstructionLeaf.prototype.render = function (block) {
        return this.instruction.render(block);
    };
    return SchemaInstructionLeaf;
}(SchemaLeaf_1.default));
exports.default = SchemaInstructionLeaf;

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
var BlockLeaf_1 = __importDefault(require("../../core/blocks/BlockLeaf"));
/**
 * BlockBlockInstructionLeaf class.
 */
var BlockBlockInstructionLeaf = /** @class */ (function (_super) {
    __extends(BlockBlockInstructionLeaf, _super);
    /**
     * Creates an instruction leaf.
     *
     * @param instruction The instruction.
     * @param options     The options.
     */
    function BlockBlockInstructionLeaf(instruction) {
        var _this = _super.call(this) || this;
        _this.instruction = instruction;
        return _this;
    }
    /**
     * Renders editing a leaf.
     *
     * @param props The render props.
     * @param i     The number child this leaf is.
     *
     * @returns The rendered element.
     */
    BlockBlockInstructionLeaf.prototype.save = function (props, i) {
        return this.instruction.save(props, this, i);
    };
    /**
     * Renders saving a leaf.
     *
     * @param props The render props.
     * @param i     The number child this leaf is.
     *
     * @returns The rendered element.
     */
    BlockBlockInstructionLeaf.prototype.edit = function (props, i) {
        return this.instruction.edit(props, this, i);
    };
    return BlockBlockInstructionLeaf;
}(BlockLeaf_1.default));
exports.default = BlockBlockInstructionLeaf;

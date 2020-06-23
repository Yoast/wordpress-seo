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
/**
 * Block instruction.
 */
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Pass on the optoins as configuration.
     *
     * @returns The configuration.
     */
    Block.prototype.configuration = function () {
        return this.options;
    };
    /**
     * Returns whether or not this instruction should be included in the tree.
     *
     * @returns Whether or not to render this instruction.
     */
    Block.prototype.renderable = function () {
        return false;
    };
    return Block;
}(BlockInstruction_1.default));
BlockInstruction_1.default.register("block", Block);

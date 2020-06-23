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
 * BlockTextLeaf class.
 */
var BlockTextLeaf = /** @class */ (function (_super) {
    __extends(BlockTextLeaf, _super);
    /**
     * Creates a text leaf.
     *
     * @param value The value.
     */
    function BlockTextLeaf(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    /**
     * Renders editing a leaf.
     *
     * @returns The rendered element.
     */
    BlockTextLeaf.prototype.save = function () {
        return this.value;
    };
    /**
     * Renders saving a leaf.
     *
     * @returns The rendered element.
     */
    BlockTextLeaf.prototype.edit = function () {
        return this.value;
    };
    return BlockTextLeaf;
}(BlockLeaf_1.default));
exports.default = BlockTextLeaf;

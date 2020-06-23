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
var element_1 = require("@wordpress/element");
/**
 * BlockRootLeaf class.
 */
var BlockRootLeaf = /** @class */ (function (_super) {
    __extends(BlockRootLeaf, _super);
    /**
     * Constructs a block root leaf.
     *
     * @param children The children.
     */
    function BlockRootLeaf(children) {
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
    }
    /**
     * Renders saving a leaf.
     *
     * @param props The render props.
     * @param i     The number child this leaf is.
     *
     * @returns The rendered element.
     */
    BlockRootLeaf.prototype.save = function (props) {
        return element_1.createElement(element_1.Fragment, null, this.children && this.children.map(function (child, i) { return child.save(props, i); }));
    };
    /**
     * Renders editing a leaf.
     *
     * @param props The render props.
     * @param i     The number child this leaf is.
     *
     * @returns The rendered element.
     */
    BlockRootLeaf.prototype.edit = function (props) {
        return element_1.createElement(element_1.Fragment, null, this.children && this.children.map(function (child, i) { return child.edit(props, i); }));
    };
    return BlockRootLeaf;
}(BlockLeaf_1.default));
exports.default = BlockRootLeaf;

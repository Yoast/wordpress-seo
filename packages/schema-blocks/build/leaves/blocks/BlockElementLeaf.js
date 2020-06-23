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
var attributeMap = { "class": "className", "for": "htmlFor" };
/**
 * BlockElementLeaf class.
 */
var BlockElementLeaf = /** @class */ (function (_super) {
    __extends(BlockElementLeaf, _super);
    /**
     * Creates an element leaf.
     *
     * @param tag        The tag.
     * @param attributes The attributes.
     * @param children   The children.
     */
    function BlockElementLeaf(tag, attributes, children) {
        if (attributes === void 0) { attributes = {}; }
        if (children === void 0) { children = []; }
        var _this = _super.call(this) || this;
        _this.tag = tag;
        _this.attributes = attributes;
        _this.children = children;
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
    BlockElementLeaf.prototype.save = function (props) {
        var attributes = {};
        for (var key in this.attributes) {
            if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
                continue;
            }
            var fixedKey = attributeMap[key] || key;
            attributes[fixedKey] = this.attributes[key]
                .map(function (leaf, i) { return leaf.save(props, i); }).join("");
        }
        return element_1.createElement(this.tag, attributes, this.children && this.children.map(function (child, i) { return child.save(props, i); }));
    };
    /**
     * Renders saving a leaf.
     *
     * @param props The render props.
     * @param i     The number child this leaf is.
     *
     * @returns The rendered element.
     */
    BlockElementLeaf.prototype.edit = function (props) {
        var attributes = {};
        for (var key in this.attributes) {
            if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
                continue;
            }
            var fixedKey = attributeMap[key] || key;
            attributes[fixedKey] = this.attributes[key]
                .map(function (leaf, i) { return leaf.edit(props, i); }).join("");
        }
        if (["button", "a"].indexOf(this.tag) !== -1) {
            attributes.onClick = function (e) {
                e.preventDefault();
                return false;
            };
        }
        return element_1.createElement(this.tag, attributes, this.children && this.children.map(function (child, i) { return child.edit(props, i); }));
    };
    return BlockElementLeaf;
}(BlockLeaf_1.default));
exports.default = BlockElementLeaf;

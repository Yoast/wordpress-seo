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
 * SchemaArrayLeaf class
 */
var SchemaArrayLeaf = /** @class */ (function (_super) {
    __extends(SchemaArrayLeaf, _super);
    /**
     * Constructs a schema array leaf.
     *
     * @param array The array.
     */
    function SchemaArrayLeaf(array) {
        var _this = _super.call(this) || this;
        _this.array = array;
        return _this;
    }
    /**
     * Renders a schema leaf.
     *
     * @param block The block.
     *
     * @returns The rendered schema.
     */
    SchemaArrayLeaf.prototype.render = function (block) {
        return this.array.map(function (leaf) { return leaf.render(block); });
    };
    return SchemaArrayLeaf;
}(SchemaLeaf_1.default));
exports.default = SchemaArrayLeaf;

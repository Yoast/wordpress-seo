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
 * SchemaInterpolatedLeaf class
 */
var SchemaInterpolatedLeaf = /** @class */ (function (_super) {
    __extends(SchemaInterpolatedLeaf, _super);
    /**
     * Constructs a schema interpolated leaf.
     *
     * @param values The values.
     */
    function SchemaInterpolatedLeaf(values) {
        var _this = _super.call(this) || this;
        _this.values = values;
        return _this;
    }
    /**
     * Renders a schema leaf.
     *
     * @param block The block.
     *
     * @returns The rendered schema.
     */
    SchemaInterpolatedLeaf.prototype.render = function (block) {
        return this.values.map(function (value) {
            if (typeof value === "string") {
                return value;
            }
            return value.render(block);
        }).join("");
    };
    return SchemaInterpolatedLeaf;
}(SchemaLeaf_1.default));
exports.default = SchemaInterpolatedLeaf;

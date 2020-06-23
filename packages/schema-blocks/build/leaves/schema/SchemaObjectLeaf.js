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
var lodash_1 = require("lodash");
var SchemaLeaf_1 = __importDefault(require("../../core/schema/SchemaLeaf"));
/**
 * SchemaObjectLeaf class
 */
var SchemaObjectLeaf = /** @class */ (function (_super) {
    __extends(SchemaObjectLeaf, _super);
    /**
     * Constructs a schema object leaf.
     *
     * @param object The object.
     */
    function SchemaObjectLeaf(object) {
        var _this = _super.call(this) || this;
        _this.object = object;
        return _this;
    }
    /**
     * Renders a schema leaf.
     *
     * @param block The block.
     *
     * @returns The rendered schema.
     */
    SchemaObjectLeaf.prototype.render = function (block) {
        var object = lodash_1.mapValues(this.object, function (leaf) { return leaf.render(block); });
        for (var _i = 0, _a = Object.entries(object); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === null || typeof value === "undefined") {
                delete object[key];
            }
        }
        return object;
    };
    return SchemaObjectLeaf;
}(SchemaLeaf_1.default));
exports.default = SchemaObjectLeaf;

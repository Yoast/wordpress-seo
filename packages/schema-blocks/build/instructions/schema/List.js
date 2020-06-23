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
var html_1 = require("../../functions/html");
/**
 * SchemaInstruction class.
 */
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders schema.
     *
     * @param block The block.
     *
     * @returns The schema.
     */
    List.prototype.render = function (block) {
        var _this = this;
        var html = block.attributes[this.options.name];
        if (typeof html !== "string") {
            return [];
        }
        var values = html_1.splitOnTag(html, this.options.tag);
        return values.map(function (value) { return html_1.stripTags(value, _this.options.allowedTags); });
    };
    return List;
}(SchemaInstruction_1.default));
exports.default = List;
SchemaInstruction_1.default.register("list", List);

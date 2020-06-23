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
var data_1 = require("@wordpress/data");
var SchemaInstruction_1 = __importDefault(require("../../core/schema/SchemaInstruction"));
/**
 * Permalink instruction
 */
var Permalink = /** @class */ (function (_super) {
    __extends(Permalink, _super);
    function Permalink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders schema.
     *
     * @returns The schema.
     */
    Permalink.prototype.render = function () {
        return data_1.select("core/editor").getPermalink();
    };
    return Permalink;
}(SchemaInstruction_1.default));
SchemaInstruction_1.default.register("permalink", Permalink);

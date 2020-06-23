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
var Instruction_1 = __importDefault(require("../Instruction"));
/**
 * SchemaInstruction class.
 */
var SchemaInstruction = /** @class */ (function (_super) {
    __extends(SchemaInstruction, _super);
    function SchemaInstruction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /**
     * Renders schema.
     *
     * @param block The block.
     *
     * @returns The schema.
     */
    SchemaInstruction.prototype.render = function (block) {
        return null;
    };
    /* eslint-enable @typescript-eslint/no-unused-vars */
    /**
     * Returns the schema definition configuration.
     *
     * @returns The configuration.
     */
    SchemaInstruction.prototype.configuration = function () {
        return {};
    };
    return SchemaInstruction;
}(Instruction_1.default));
exports.default = SchemaInstruction;
